import './SimulacaoModule.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getFoto, getServico, setResultado } from '../../../lib/atendimentoFlow'
import { gerarSimulacao } from '../../../lib/geracao'

const ETAPAS = [
  'Analisando o rosto...',
  'Aplicando o estilo escolhido...',
  'Gerando variações...',
  'Finalizando a simulação...'
]

function Simulacao() {
  const navigate = useNavigate()
  const location = useLocation()
  const jaIniciou = useRef(false)

  const estilo = location.state?.estilo
  const variacaoEscolhida =
    location.state?.cor ||
    location.state?.tonalidade ||
    location.state?.variacao

  const [etapaAtual, setEtapaAtual] = useState(0)
  const [erro, setErro] = useState('')

  async function gerar() {
    setErro('')
    setEtapaAtual(0)

    const foto = getFoto()

    if (!foto) {
      navigate('/captura')
      return
    }

    if (!estilo) {
      navigate('/service')
      return
    }

    try {
      const resultado = await gerarSimulacao({
        foto,
        servico: getServico(),
        estilo,
        variacaoEscolhida
      })

      setResultado({
        estilo,
        variacaoEscolhida,
        variacoes: resultado.variacoes
      })

      navigate('/resultado')
    } catch (err) {
      console.error('Erro na geração da simulação:', err)
      setErro('Não foi possível gerar a simulação. Sua foto foi preservada — tente novamente.')
    }
  }

  useEffect(() => {
    if (jaIniciou.current) return
    jaIniciou.current = true
    gerar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (erro) return

    const timer = setInterval(() => {
      setEtapaAtual(etapa => Math.min(etapa + 1, ETAPAS.length - 1))
    }, 1200)

    return () => clearInterval(timer)
  }, [erro])

  return (
    <div className="SimulacaoContainer">
      <div className="SimulacaoContent">

        <div className="ProgressBar">
          <span className="active"></span>
          <span className="active"></span>
          <span className="active"></span>
          <span className="active"></span>
          <span className="active"></span>
          <span></span>
        </div>

        <div className="SimulacaoCentro">

          {!erro ? (
            <>
              <div className="SimulacaoOrbita">
                <div className="SimulacaoNucleo">✦</div>
              </div>

              <p className="SimulacaoEyebrow">ATENDIMENTO • PASSO 5</p>
              <h3 className="SimulacaoTitulo">Processando com IA</h3>

              <p className="SimulacaoEtapa">{ETAPAS[etapaAtual]}</p>

              <ul className="SimulacaoChecklist">
                {ETAPAS.map((etapa, i) => (
                  <li
                    key={etapa}
                    className={
                      i < etapaAtual ? 'feita' : i === etapaAtual ? 'atual' : ''
                    }
                  >
                    {i < etapaAtual ? '✓' : '•'} {etapa}
                  </li>
                ))}
              </ul>

              <p className="SimulacaoNota">
                {estilo?.title} {variacaoEscolhida ? `• ${variacaoEscolhida}` : ''}
              </p>
            </>
          ) : (
            <>
              <div className="SimulacaoErroIcone">!</div>
              <h3 className="SimulacaoTitulo">Algo deu errado</h3>
              <p className="SimulacaoErroTexto">{erro}</p>

              <button className="SimulacaoBtnPrimario" onClick={gerar}>
                Tentar novamente
              </button>

              <button
                className="SimulacaoBtnSecundario"
                onClick={() => navigate('/service')}
              >
                ← Voltar aos serviços
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  )
}

export default Simulacao
