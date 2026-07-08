// Supabase Edge Function — gerar-simulacao
//
// Recebe a foto do cliente + estilo escolhido e retorna 2-4 variações geradas
// por IA (doc v4.0, seção 5: preservar identidade, alterar só cabelo/barba,
// meta de ~20-30s ponta a ponta).
//
// O motor de IA ainda não foi definido (candidatos: Flux 2 Pro, Imagen 4 Ultra,
// Gemini). Enquanto a decisão não sai, o provider "mock" devolve a própria foto
// como variação — o contrato com o frontend já fica fechado.
//
// Deploy:  supabase functions deploy gerar-simulacao
// Secrets: supabase secrets set IA_PROVIDER=mock (ou flux/gemini + API keys)

interface RequisicaoGeracao {
  foto: string // dataURL (base64) da foto do cliente
  servico: string // corte | coloracao | barba | corte-barba
  estilo: {
    nome: string
    descricao: string
    variacoes: string[]
  }
  variacaoEscolhida: string
}

interface Variacao {
  nome: string
  imagem: string // dataURL ou URL pública da imagem gerada
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

function montarPrompt(req: RequisicaoGeracao, variacao: string): string {
  return [
    `Edite a foto alterando SOMENTE o cabelo/barba da pessoa.`,
    `Preserve totalmente a identidade: rosto, tom de pele e estrutura óssea.`,
    `Serviço: ${req.servico}. Estilo: ${req.estilo.nome} — ${req.estilo.descricao}.`,
    `Variação a aplicar: ${variacao}.`,
    `Resultado fotorrealista, mesma pose, mesmo fundo e mesma iluminação.`
  ].join(' ')
}

// ── Providers ───────────────────────────────────────────────────────────────

async function providerMock(req: RequisicaoGeracao): Promise<Variacao[]> {
  const nomes = [
    req.variacaoEscolhida,
    ...req.estilo.variacoes.filter((v) => v !== req.variacaoEscolhida)
  ].slice(0, 3)

  return nomes.map((nome) => ({ nome, imagem: req.foto }))
}

// TODO (decidir motor com o Rafael antes da Fase 2):
// async function providerFlux(req) — Flux via Replicate/fal.ai: enviar foto +
//   montarPrompt(), modo image-to-image com máscara de cabelo, 2-4 outputs.
// async function providerGemini(req) — Gemini image editing: uma chamada por
//   variação com montarPrompt(), retorno em base64.

async function gerar(req: RequisicaoGeracao): Promise<Variacao[]> {
  const provider = Deno.env.get('IA_PROVIDER') ?? 'mock'

  switch (provider) {
    case 'mock':
      return providerMock(req)
    default:
      throw new Error(`Provider de IA não implementado: ${provider}`)
  }
}

// ── Handler ─────────────────────────────────────────────────────────────────

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const req = (await request.json()) as RequisicaoGeracao

    if (!req.foto || !req.estilo?.nome) {
      return new Response(
        JSON.stringify({ error: 'Foto e estilo são obrigatórios.' }),
        { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
      )
    }

    const variacoes = await gerar(req)

    return new Response(JSON.stringify({ variacoes }), {
      headers: { ...CORS, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Erro na geração:', err)

    return new Response(
      JSON.stringify({ error: 'Falha ao gerar a simulação.' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }
})
