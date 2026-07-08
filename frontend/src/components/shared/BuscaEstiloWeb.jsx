import './BuscaEstiloWeb.css'
import { useState } from 'react'

// Busca de estilos na web.
//
// Ordem dos motores, conforme a chave disponível no .env:
// 1. Google Custom Search (VITE_GOOGLE_CSE_KEY + VITE_GOOGLE_CSE_CX) —
//    Google Imagens, 100 buscas/dia grátis.
// 2. Pexels (VITE_PEXELS_KEY) — banco de fotos profissional, chave gratuita.
// 3. Openverse — sem chave; acervo de licença aberta, relevância fraca
//    (existe só para o fluxo não quebrar sem configuração).

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_CSE_KEY
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CSE_CX
const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY

const usaGoogle = Boolean(GOOGLE_KEY && GOOGLE_CX)
const usaPexels = Boolean(PEXELS_KEY)

async function consultarGoogle(consulta) {
  const url =
    `https://www.googleapis.com/customsearch/v1` +
    `?key=${GOOGLE_KEY}&cx=${GOOGLE_CX}` +
    `&searchType=image&num=9&safe=active` +
    `&q=${encodeURIComponent(consulta)}`

  const resposta = await fetch(url)

  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)

  const dados = await resposta.json()

  return (dados.items || []).map((item) => ({
    id: item.link,
    title: item.title,
    thumbnail: item.image?.thumbnailLink,
    url: item.link
  }))
}

async function consultarPexels(consulta) {
  const resposta = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(consulta)}&per_page=12`,
    { headers: { Authorization: PEXELS_KEY } }
  )

  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)

  const dados = await resposta.json()

  return (dados.photos || []).map((item) => ({
    id: String(item.id),
    title: item.alt,
    thumbnail: item.src?.medium,
    url: item.src?.large || item.src?.original
  }))
}

async function consultarOpenverse(consulta) {
  const resposta = await fetch(
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(consulta)}&page_size=12`
  )

  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)

  const dados = await resposta.json()

  return (dados.results || []).map((item) => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail || item.url,
    url: item.url
  }))
}

function BuscaEstiloWeb({ contexto, placeholder, variacoesPadrao, selecionadoId, onSelecionar }) {
  const [termo, setTermo] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState('')
  const [jaBuscou, setJaBuscou] = useState(false)

  async function buscar(e) {
    e?.preventDefault()

    if (!termo.trim() || buscando) return

    setBuscando(true)
    setErro('')

    try {
      let itens

      if (usaGoogle) {
        // Google entende português e ranqueia por relevância
        itens = await consultarGoogle(`${termo} ${contexto}`)
      } else if (usaPexels) {
        // Pexels ranqueia bem; busca com contexto e refaz sem se zerar
        itens = await consultarPexels(`${termo} ${contexto}`)

        if (itens.length === 0) {
          itens = await consultarPexels(termo)
        }
      } else {
        // Openverse faz AND de todas as palavras: tenta com contexto
        // em inglês e refaz só com o termo se zerar
        itens = await consultarOpenverse(`${termo} ${contexto}`)

        if (itens.length === 0) {
          itens = await consultarOpenverse(termo)
        }
      }

      setResultados(itens)
      setJaBuscou(true)
    } catch (err) {
      console.error('Erro na busca de estilos:', err)
      setErro('Não foi possível buscar agora. Tente novamente.')
    } finally {
      setBuscando(false)
    }
  }

  function selecionar(item) {
    onSelecionar({
      webId: item.id,
      img: item.thumbnail || item.url,
      title: item.title || termo,
      tIndic: 'Referência da web',
      desc: `Estilo de referência buscado na web: "${termo}". A IA usa esta imagem como guia.`,
      vaCor: variacoesPadrao
    })
  }

  return (
    <div className="BuscaWebBox">
      <form className="BuscaWebForm" onSubmit={buscar}>
        <input
          type="text"
          placeholder={placeholder}
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />
        <button type="submit" disabled={buscando || !termo.trim()}>
          {buscando ? '...' : '🔍'}
        </button>
      </form>

      {erro && <p className="BuscaWebStatus erro">{erro}</p>}

      {buscando && <p className="BuscaWebStatus">Buscando estilos...</p>}

      {!buscando && jaBuscou && resultados.length === 0 && !erro && (
        <p className="BuscaWebStatus">Nenhum resultado. Tente outro termo.</p>
      )}

      {resultados.length > 0 && (
        <div className="BuscaWebGrid">
          {resultados.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`BuscaWebItem ${selecionadoId === item.id ? 'selected' : ''}`}
              onClick={() => selecionar(item)}
              title={item.title}
            >
              <img src={item.thumbnail} alt={item.title || 'Estilo'} loading="lazy" />
              {selecionadoId === item.id && (
                <span className="BuscaWebCheck">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default BuscaEstiloWeb
