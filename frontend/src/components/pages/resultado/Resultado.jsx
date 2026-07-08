import './ResultadoModule.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import {
  getFoto,
  getCliente,
  getResultado,
  limparAtendimento
} from '../../../lib/atendimentoFlow'

function Resultado() {
  const navigate = useNavigate()

  const foto = getFoto()
  const cliente = getCliente()
  const resultado = getResultado()

  const [indiceAtivo, setIndiceAtivo] = useState(0)
  const [aprovando, setAprovando] = useState(false)
  const [erro, setErro] = useState('')

  if (!resultado || !foto) {
    return (
      <div className="ResultadoContainer">
        <div className="ResultadoContent ResultadoVazio">
          <p>Nenhuma simulação em andamento.</p>
          <button
            className="ResultadoBtnPrimario"
            onClick={() => navigate('/home')}
          >
            Voltar à Home
          </button>
        </div>
      </div>
    )
  }

  const { estilo, variacoes } = resultado
  const variacaoAtiva = variacoes[indiceAtivo]

  async function aprovarResultado() {
    setErro('')

    try {
      setAprovando(true)

      if (cliente?.id) {
        const { error } = await supabase
          .from('A3_CLIENTE')
          .update({
            A3_NATEND: Number(cliente.A3_NATEND || 0) + 1
          })
          .eq('id', cliente.id)

        if (error) throw error
      }

      limparAtendimento()
      navigate('/home')
    } catch (err) {
      console.error('Erro ao aprovar resultado:', err)
      setErro('Erro ao salvar o resultado. Tente novamente.')
    } finally {
      setAprovando(false)
    }
  }

  return (
    <div className="ResultadoContainer">
      <div className="ResultadoContent">

        <div className="ProgressBar">
          <span className="active"></span>
          <span className="active"></span>
          <span className="active"></span>
          <span className="active"></span>
          <span className="active"></span>
          <span className="active"></span>
        </div>

        <div className="ResultadoHeader">
          <div>
            <p className="eyebrow">ATENDIMENTO • PASSO 6</p>
            <h3>Veja o resultado</h3>
          </div>
        </div>

        <div className="ResultadoComparacao">
          <figure className="ResultadoFigura">
            <img src={foto} alt="Antes" />
            <figcaption>ANTES</figcaption>
          </figure>

          <figure className="ResultadoFigura depois">
            <img src={variacaoAtiva.imagem} alt={`Depois — ${variacaoAtiva.nome}`} />
            <figcaption>DEPOIS</figcaption>
          </figure>
        </div>

        <div className="ResultadoPainel">
          <h4 className="ResultadoEstiloNome">{estilo?.title}</h4>

          <div className="ResultadoVariacoes">
            {variacoes.map((variacao, i) => (
              <button
                key={variacao.nome}
                className={`ResultadoChip ${i === indiceAtivo ? 'selected' : ''}`}
                onClick={() => setIndiceAtivo(i)}
              >
                {variacao.nome}
              </button>
            ))}
          </div>
        </div>

        {erro && <p className="ResultadoErro">{erro}</p>}

        <div className="ResultadoAcoes">
          <button
            className="ResultadoBtnPrimario"
            onClick={aprovarResultado}
            disabled={aprovando}
          >
            {aprovando ? 'Salvando...' : '✓ Aprovar este resultado'}
          </button>

          <div className="ResultadoAcoesLinha">
            <button
              className="ResultadoBtnSecundario"
              onClick={() => navigate('/service')}
            >
              Outro estilo
            </button>

            <button
              className="ResultadoBtnSecundario"
              onClick={() => navigate('/captura')}
            >
              Nova foto
            </button>
          </div>

          <button
            className="ResultadoBtnLink"
            onClick={() => navigate('/marketplace')}
          >
            Ver produtos recomendados →
          </button>
        </div>

      </div>
    </div>
  )
}

export default Resultado
