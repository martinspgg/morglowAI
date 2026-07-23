import type { GeneratedVariation, ProviderInput, ProviderResult } from '../types.ts'

const DEFAULT_TIMEOUT_MS = 60000

function getFluxConfig(): { apiUrl: string; apiKey: string; timeoutMs: number } {
  const apiUrl = Deno.env.get('FLUX_API_URL')?.trim()
  const apiKey = Deno.env.get('FLUX_API_KEY')?.trim()
  const timeoutMs = Number(Deno.env.get('FLUX_TIMEOUT_MS') || DEFAULT_TIMEOUT_MS)

  if (!apiUrl) throw new Error('FLUX_API_URL ausente.')
  if (!apiKey) throw new Error('FLUX_API_KEY ausente.')

  return {
    apiUrl,
    apiKey,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function readNestedUrl(value: unknown): string | undefined {
  if (typeof value === 'string') return asString(value)
  if (!isRecord(value)) return undefined

  return (
    asString(value.image_url) ||
    asString(value.imageUrl) ||
    asString(value.resultadoUrl) ||
    asString(value.resultUrl) ||
    asString(value.url) ||
    asString(value.uri) ||
    readBase64Artifact(value)
  )
}

function readBase64Artifact(value: Record<string, unknown>): string | undefined {
  const mimeType = asString(value.mime_type) || asString(value.mimeType) || 'image/png'
  const base64 = asString(value.base64) || asString(value.b64_json)

  return base64 ? `data:${mimeType};base64,${base64}` : undefined
}

function collectCandidateUrls(body: unknown): string[] {
  const candidates: string[] = []

  const visit = (value: unknown): void => {
    const directUrl = readNestedUrl(value)
    if (directUrl) candidates.push(directUrl)

    if (Array.isArray(value)) {
      value.forEach(visit)
      return
    }

    if (!isRecord(value)) return

    const nestedKeys = [
      'output',
      'outputs',
      'images',
      'data',
      'result',
      'results',
      'artifacts',
      'predictions'
    ]

    nestedKeys.forEach((key) => {
      if (key in value) visit(value[key])
    })
  }

  visit(body)

  return [...new Set(candidates)]
}

function buildProviderPayload(input: ProviderInput): Record<string, unknown> {
  return {
    prompt: input.prompt,
    image: input.image,
    input_image: input.image,
    image_url: input.image,
    service: input.service,
    service_label: input.serviceLabel,
    style: input.style,
    style_name: input.styleName,
    style_description: input.styleDescription,
    color: input.color,
    color_label: input.colorLabel,
    variation: input.variationLabel,
    mode: 'image-to-image',
    output_format: 'jpeg',
    num_outputs: 1,
    guidance: 'preserve_identity_change_only_hair_beard'
  }
}

function buildVariation(imageUrl: string, index: number, label?: string): GeneratedVariation {
  const variationLabel = label || `Variação ${index + 1}`

  return {
    id: `var_${index + 1}`,
    url: imageUrl,
    imageUrl,
    label: variationLabel,
    nome: variationLabel,
    imagem: imageUrl
  }
}

async function readJsonSafely(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text.trim()) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { rawText: text }
  }
}

export async function generateWithFlux(input: ProviderInput): Promise<ProviderResult> {
  const { apiUrl, apiKey, timeoutMs } = getFluxConfig()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'x-api-key': apiKey
      },
      body: JSON.stringify(buildProviderPayload(input)),
      signal: controller.signal
    })

    const body = await readJsonSafely(response)

    if (!response.ok) {
      const bodySummary = typeof body === 'string' ? body : JSON.stringify(body).slice(0, 500)
      throw new Error(`FLUX respondeu HTTP ${response.status}: ${bodySummary}`)
    }

    const urls = collectCandidateUrls(body)

    if (urls.length === 0) {
      throw new Error('FLUX nao retornou URL ou base64 de imagem.')
    }

    const labels = [
      input.variationLabel,
      input.colorLabel,
      ...input.styleVariations
    ].filter((label): label is string => Boolean(label))

    const variations = urls.slice(0, 4).map((url, index) => buildVariation(url, index, labels[index]))

    return {
      imageUrl: variations[0].imageUrl,
      variations,
      provider: 'flux',
      model: 'flux-compatible-http',
      raw: body
    }
  } finally {
    clearTimeout(timeout)
  }
}
