// Camada de geração de simulação por IA.
//
// O motor de IA ainda não foi definido (candidatos: Flux 2 Pro, Imagen 4 Ultra,
// Gemini). Enquanto isso, USAR_MOCK gera variações localmente aplicando filtros
// na própria foto — o fluxo completo funciona e a troca pelo motor real é só
// mudar a flag: a chamada de produção vai para a Supabase Edge Function
// `gerar-simulacao` (a chave da API fica no servidor, nunca no navegador).
//
// Contrato (doc v4.0, seção 5): preservar identidade, alterar só cabelo/barba,
// retornar de 2 a 4 variações, meta de ~20-30s ponta a ponta.

import { supabase } from './supabase'

const USAR_MOCK = true

const FILTROS_MOCK = [
  'none',
  'sepia(0.35) saturate(1.25) brightness(1.03)',
  'hue-rotate(20deg) brightness(1.05) contrast(1.05)',
  'contrast(1.12) brightness(0.94) saturate(0.9)'
]

function aplicarFiltro(fotoDataUrl, filtro) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.filter = filtro
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = fotoDataUrl
  })
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function gerarMock({ foto, estilo, variacaoEscolhida }) {
  // Simula o tempo real de geração (meta: 20-30s; mock encurtado)
  await esperar(3500)

  const nomes = estilo?.vaCor || estilo?.variacoes || []
  const ordenados = [
    variacaoEscolhida,
    ...nomes.filter(nome => nome !== variacaoEscolhida)
  ].filter(Boolean).slice(0, 3)

  const variacoes = await Promise.all(
    ordenados.map(async (nome, i) => ({
      nome,
      imagem: await aplicarFiltro(foto, FILTROS_MOCK[i % FILTROS_MOCK.length])
    }))
  )

  return { variacoes }
}

async function gerarReal({ foto, servico, estilo, variacaoEscolhida }) {
  const { data, error } = await supabase.functions.invoke('gerar-simulacao', {
    body: {
      foto,
      servico,
      estilo: {
        nome: estilo?.title,
        descricao: estilo?.desc,
        variacoes: estilo?.vaCor || estilo?.variacoes || []
      },
      variacaoEscolhida
    }
  })

  if (error) throw error
  return data
}

export async function gerarSimulacao(parametros) {
  if (!parametros?.foto) {
    throw new Error('Foto do cliente ausente.')
  }

  if (USAR_MOCK) {
    return gerarMock(parametros)
  }

  return gerarReal(parametros)
}
