import type { GeneratedVariation, ProviderInput, ProviderResult } from '../types.ts'

function uniqueLabels(labels: string[]): string[] {
  const seen = new Set<string>()

  return labels.filter((label) => {
    const normalized = label.trim()
    if (!normalized || seen.has(normalized.toLowerCase())) return false

    seen.add(normalized.toLowerCase())
    return true
  })
}

function buildVariationLabels(input: ProviderInput): string[] {
  const labels = uniqueLabels([
    input.variationLabel || '',
    input.colorLabel || '',
    ...input.styleVariations
  ])

  if (labels.length > 0) return labels.slice(0, 3)

  return ['Variação 1', 'Variação 2', 'Variação 3']
}

function buildVariation(image: string, label: string, index: number): GeneratedVariation {
  return {
    id: `var_${index + 1}`,
    url: image,
    imageUrl: image,
    label,
    nome: label,
    imagem: image
  }
}

export async function generateWithMock(input: ProviderInput): Promise<ProviderResult> {
  const variations = buildVariationLabels(input).map((label, index) =>
    buildVariation(input.image, label, index)
  )

  return {
    imageUrl: variations[0]?.imageUrl || input.image,
    variations,
    provider: 'mock',
    model: 'morglow-mock-pass-through'
  }
}
