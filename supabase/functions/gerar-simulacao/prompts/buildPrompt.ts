import type { NormalizedPayload, ServiceType } from '../types.ts'

const serviceInstructions: Record<ServiceType, string> = {
  haircut:
    'Change only the haircut: shape, length, volume, texture, fringe, fade or layers according to the selected style.',
  color:
    'Change only the hair color, shade, highlights or color treatment according to the selected color and style.',
  beard:
    'Change only the beard: length, contour, density, line-up and grooming according to the selected style.',
  haircut_beard:
    'Change only the haircut and beard according to the selected style, keeping every other visual element unchanged.',
  unknown:
    'Apply only the requested hair, hair color or beard change. Do not alter anything outside that grooming area.'
}

function stringifyValue(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    return value.map(stringifyValue).filter(Boolean).join(', ')
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const preferred = [
      record.nome,
      record.name,
      record.title,
      record.descricao,
      record.description,
      record.desc
    ]
      .map(stringifyValue)
      .filter(Boolean)

    if (preferred.length > 0) return preferred.join(' - ')

    try {
      return JSON.stringify(value)
    } catch {
      return ''
    }
  }

  return ''
}

export function buildPrompt(input: NormalizedPayload): string {
  const styleParts = [
    input.styleName,
    input.styleDescription,
    stringifyValue(input.style)
  ].filter(Boolean)

  const colorDescription = input.colorLabel || stringifyValue(input.color)
  const variationDescription = input.variationLabel
  const styleVariations = input.styleVariations.join(', ')

  return [
    'Photorealistic image-to-image edit for a beauty salon client simulation.',
    'Use the provided input image as the identity, pose, lighting and background reference.',
    `Selected service: ${input.serviceLabel || input.service}.`,
    `Service instruction: ${serviceInstructions[input.service]}.`,
    styleParts.length > 0 ? `Target style: ${styleParts.join(' | ')}.` : '',
    colorDescription ? `Selected color or tone: ${colorDescription}.` : '',
    variationDescription ? `Chosen variation: ${variationDescription}.` : '',
    styleVariations ? `Available style variations: ${styleVariations}.` : '',
    'Strict identity preservation rules:',
    'Preserve exactly the same face, eyes, nose, mouth, jaw, facial expression, apparent age, skin tone, clothing and background.',
    'Keep the same camera angle, framing, lighting, shadows, photographic texture and realism of the original image.',
    'Do not transform the person into someone else.',
    'Do not change gender, apparent age, bone structure, clothes, accessories or the environment.',
    'Do not create an artistic style, cartoon, illustration, avatar, studio portrait, makeup change or background replacement.',
    'Only modify hair, hair color and/or beard as required by the selected service.'
  ]
    .filter(Boolean)
    .join('\n')
}
