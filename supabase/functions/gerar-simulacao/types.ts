export type ServiceType = 'haircut' | 'color' | 'beard' | 'haircut_beard' | 'unknown'

export type ProviderName = 'flux' | 'mock'

export type LoosePayload = Record<string, unknown>

export interface NormalizedPayload {
  image: string
  service: ServiceType
  serviceLabel: string
  style?: unknown
  styleName?: string
  styleDescription?: string
  styleVariations: string[]
  color?: unknown
  colorLabel?: string
  variationLabel?: string
  appointmentId?: string
  raw: LoosePayload
}

export interface ProviderInput extends NormalizedPayload {
  prompt: string
}

export interface GeneratedVariation {
  id: string
  url: string
  imageUrl: string
  label: string
  nome: string
  imagem: string
}

export interface ProviderResult {
  imageUrl: string
  variations: GeneratedVariation[]
  provider: ProviderName
  model: string
  raw?: unknown
}

export interface SuccessResponse {
  success: true
  ok: true
  status: 'success'
  resultadoUrl: string
  resultUrl: string
  imageUrl: string
  url: string
  variacoes: GeneratedVariation[]
  variations: GeneratedVariation[]
  metadata: {
    provider: ProviderName
    model: string
    durationMs: number
    mode: 'single_simulation'
    appointmentId?: string
    fallback?: boolean
    requestedProvider?: string
    error?: string
  }
}

export interface ErrorResponse {
  success: false
  ok: false
  status: 'error'
  message: string
  error: string
}
