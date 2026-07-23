import { buildPrompt } from './prompts/buildPrompt.ts'
import { generateWithFlux } from './providers/fluxProvider.ts'
import { generateWithMock } from './providers/mockProvider.ts'
import type {
  GeneratedVariation,
  LoosePayload,
  NormalizedPayload,
  ProviderInput,
  ProviderResult,
  ServiceType,
  SuccessResponse
} from './types.ts'
import { errorMessage, errorResponse, jsonResponse, optionsResponse } from './utils/http.ts'

const IMAGE_FIELDS = [
  'foto',
  'image',
  'imageUrl',
  'image_url',
  'fotoUrl',
  'originalImage',
  'original_image',
  'base64'
]

const SERVICE_FIELDS = ['servico', 'service', 'serviceType', 'tipoServico']
const STYLE_FIELDS = ['estilo', 'style', 'selectedStyle', 'selected_style']
const COLOR_FIELDS = [
  'cor',
  'color',
  'selectedColor',
  'selected_color',
  'variacaoCor',
  'variacaoEscolhida',
  'variation',
  'selectedVariation',
  'selected_variation'
]
const APPOINTMENT_FIELDS = ['atendimentoId', 'appointmentId', 'appointment_id', 'A3_ID']

class InputError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'InputError'
    this.code = code
  }
}

function isRecord(value: unknown): value is LoosePayload {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function getFirstValue(payload: LoosePayload, fields: string[]): unknown {
  for (const field of fields) {
    const value = payload[field]
    if (value !== undefined && value !== null && value !== '') return value
  }

  return undefined
}

function toText(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || undefined
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return undefined
}

function getObjectText(value: unknown, fields: string[]): string | undefined {
  if (!isRecord(value)) return undefined

  return toText(getFirstValue(value, fields))
}

function extractStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (typeof item === 'string') return item.trim()
      if (isRecord(item)) {
        return (
          getObjectText(item, ['nome', 'name', 'label', 'title']) ||
          getObjectText(item, ['descricao', 'description', 'desc'])
        )
      }
      return undefined
    })
    .filter((item): item is string => Boolean(item))
}

function extractStyleVariations(style: unknown): string[] {
  if (!isRecord(style)) return []

  const variationValue =
    style.variacoes ||
    style.vaCor ||
    style.variations ||
    style.cores ||
    style.colors ||
    style.tons ||
    style.tonalidades

  return extractStringList(variationValue)
}

function normalizeService(value: unknown): { service: ServiceType; serviceLabel: string } {
  const label = toText(value) || 'unknown'
  const normalized = label
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '_')

  if (['haircut', 'corte', 'corte_cabelo', 'cabelo'].includes(normalized)) {
    return { service: 'haircut', serviceLabel: label }
  }

  if (['color', 'coloracao', 'coloração', 'tintura', 'cor'].includes(normalized)) {
    return { service: 'color', serviceLabel: label }
  }

  if (['beard', 'barba'].includes(normalized)) {
    return { service: 'beard', serviceLabel: label }
  }

  if (
    [
      'haircut_beard',
      'corte_barba',
      'corte_e_barba',
      'corte+barba',
      'corte-barba',
      'misto'
    ].includes(normalized)
  ) {
    return { service: 'haircut_beard', serviceLabel: label }
  }

  return { service: 'unknown', serviceLabel: label }
}

function describeLooseValue(value: unknown): string | undefined {
  const text = toText(value)
  if (text) return text

  if (!isRecord(value)) return undefined

  return (
    getObjectText(value, ['nome', 'name', 'title', 'label']) ||
    getObjectText(value, ['descricao', 'description', 'desc'])
  )
}

async function readPayload(request: Request): Promise<LoosePayload> {
  try {
    const payload = await request.json()
    if (!isRecord(payload)) {
      throw new InputError('Payload JSON invalido.', 'INVALID_JSON_PAYLOAD')
    }

    return payload
  } catch (error) {
    if (error instanceof InputError) throw error
    throw new InputError('Body JSON invalido ou ausente.', 'INVALID_JSON_BODY')
  }
}

function normalizePayload(payload: LoosePayload): NormalizedPayload {
  const image = toText(getFirstValue(payload, IMAGE_FIELDS))

  if (!image) {
    throw new InputError('Imagem não enviada.', 'IMAGE_NOT_SENT')
  }

  const rawService = getFirstValue(payload, SERVICE_FIELDS)
  const { service, serviceLabel } = normalizeService(rawService)
  const style = getFirstValue(payload, STYLE_FIELDS)
  const color = getFirstValue(payload, COLOR_FIELDS)
  const appointmentId = toText(getFirstValue(payload, APPOINTMENT_FIELDS))

  return {
    image,
    service,
    serviceLabel,
    style,
    styleName: getObjectText(style, ['nome', 'name', 'title', 'label']) || describeLooseValue(style),
    styleDescription: getObjectText(style, ['descricao', 'description', 'desc']),
    styleVariations: extractStyleVariations(style),
    color,
    colorLabel: describeLooseValue(color),
    variationLabel: toText(payload.variacaoEscolhida) || describeLooseValue(color),
    appointmentId,
    raw: payload
  }
}

function getRequestedProvider(): string {
  return (Deno.env.get('AI_PROVIDER') || Deno.env.get('IA_PROVIDER') || 'mock').trim().toLowerCase()
}

function canUseFlux(provider: string): boolean {
  return provider === 'flux' && Boolean(Deno.env.get('FLUX_API_KEY')?.trim())
}

function normalizeVariations(result: ProviderResult, fallbackImage: string): GeneratedVariation[] {
  if (result.variations.length > 0) return result.variations

  return [
    {
      id: 'var_1',
      url: result.imageUrl || fallbackImage,
      imageUrl: result.imageUrl || fallbackImage,
      label: 'Variação 1',
      nome: 'Variação 1',
      imagem: result.imageUrl || fallbackImage
    }
  ]
}

function buildSuccessResponse(
  result: ProviderResult,
  input: NormalizedPayload,
  durationMs: number,
  fallback?: { requestedProvider: string; error: string }
): SuccessResponse {
  const variations = normalizeVariations(result, input.image)
  const imageUrl = result.imageUrl || variations[0].imageUrl

  return {
    success: true,
    ok: true,
    status: 'success',
    resultadoUrl: imageUrl,
    resultUrl: imageUrl,
    imageUrl,
    url: imageUrl,
    variacoes: variations,
    variations,
    metadata: {
      provider: result.provider,
      model: result.model,
      durationMs,
      mode: 'single_simulation',
      appointmentId: input.appointmentId,
      fallback: fallback ? true : undefined,
      requestedProvider: fallback?.requestedProvider,
      error: fallback?.error
    }
  }
}

async function generate(input: ProviderInput): Promise<{
  result: ProviderResult
  fallback?: { requestedProvider: string; error: string }
}> {
  const requestedProvider = getRequestedProvider()

  if (!canUseFlux(requestedProvider)) {
    return { result: await generateWithMock(input) }
  }

  try {
    return { result: await generateWithFlux(input) }
  } catch (error) {
    console.error('Falha no provider FLUX, usando mock:', error)

    return {
      result: await generateWithMock(input),
      fallback: {
        requestedProvider,
        error: errorMessage(error)
      }
    }
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return optionsResponse()
  }

  if (request.method !== 'POST') {
    return errorResponse('Metodo nao permitido.', 'METHOD_NOT_ALLOWED', 405)
  }

  const startedAt = Date.now()

  try {
    const payload = await readPayload(request)
    const normalizedPayload = normalizePayload(payload)
    const providerInput: ProviderInput = {
      ...normalizedPayload,
      prompt: buildPrompt(normalizedPayload)
    }

    const { result, fallback } = await generate(providerInput)
    const durationMs = Date.now() - startedAt

    return jsonResponse(buildSuccessResponse(result, normalizedPayload, durationMs, fallback))
  } catch (error) {
    console.error('Erro na geração da simulação:', error)

    if (error instanceof InputError) {
      return errorResponse(error.message, error.code, 400)
    }

    return errorResponse(
      'Não foi possível gerar a simulação. Sua foto foi preservada; tente novamente.',
      errorMessage(error),
      200
    )
  }
})
