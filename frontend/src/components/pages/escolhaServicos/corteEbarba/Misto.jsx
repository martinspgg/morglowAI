import './MistoModule.css'
import { useNavigate } from 'react-router-dom'
import back from '../../../../images/move-left.png'
import { useState } from 'react'
import BuscaEstiloWeb from '../../../shared/BuscaEstiloWeb.jsx'

function Misto() {
  const navigate = useNavigate()

  const [comboSelecionado, setComboSelecionado] = useState(null)
  const [corSelecionada, setCorSelecionada] = useState('')

  const combos = [
    {
      img: '',
      title: 'Degradê + Barba Cheia',
      tIndic: 'Oval, Quadrado — visual marcante',
      desc: 'Fade progressivo conectado à barba cheia com contornos definidos.',
      vaCor: ['Natural', 'Castanho com luzes', 'Preto natural']
    },
    {
      img: '',
      title: 'Clássico + Cavanhaque',
      tIndic: 'Todos os formatos — elegante',
      desc: 'Corte tradicional com cavanhaque alinhado ao maxilar.',
      vaCor: ['Natural', 'Castanho', 'Grisalho realçado']
    },
    {
      img: '',
      title: 'Undercut + Stubble',
      tIndic: 'Oval, Losango — despojado',
      desc: 'Lateral raspada com topo longo e barba rente uniforme.',
      vaCor: ['Natural', 'Ombré', 'Platinado']
    },
    {
      img: '',
      title: 'Fade + Barba Desenhada',
      tIndic: 'Redondo, Oval — linhas precisas',
      desc: 'Degradê alto integrado à barba com contornos geométricos.',
      vaCor: ['Natural', 'Glossagem', 'Reflexo suave']
    },
    {
      img: '',
      title: 'Natural + Barba Livre',
      tIndic: 'Todos — manutenção simples',
      desc: 'Corte orgânico com barba modelada respeitando o crescimento.',
      vaCor: ['Natural', 'Castanho', 'Mel']
    }
  ]

  function selecionarCombo(item) {
    setComboSelecionado(item)
    setCorSelecionada('')
  }

  function gerarSimulacao() {
    if (!comboSelecionado || !corSelecionada) return

    navigate('/simulacao', {
      state: {
        estilo: comboSelecionado,
        cor: corSelecionada
      }
    })
  }

  return (
    <div className='cabeloContainer'>
      <div className='cabeloContent'>

        <div className='ProgressBar'>
          <span className='active'></span>
          <span className='active'></span>
          <span className='active'></span>
          <span className='active'></span>
          <span></span>
          <span></span>
        </div>

        <div className="cabeloHeader">
          <button
            className="backView"
            onClick={() => navigate('/service')}
          >
            <img src={back} alt="Voltar" />
          </button>

          <div className="cabeloHeaderText">
            <p className="eyebrow">ATENDIMENTO • PASSO 4</p>
            <h3>Escolha o combo</h3>
          </div>
        </div>

        <BuscaEstiloWeb
          contexto="haircut beard"
          placeholder="Buscar corte + barba na web..."
          variacoesPadrao={['Natural', 'Tom claro', 'Tom escuro']}
          selecionadoId={comboSelecionado?.webId}
          onSelecionar={selecionarCombo}
        />

        <div className="estilosCards">
          {combos.map((item, index) => (
            <div
              className={`card ${comboSelecionado?.title === item.title ? 'selected' : ''}`}
              key={index}
              onClick={() => selecionarCombo(item)}
            >
              {comboSelecionado?.title === item.title && (
                <span className="checkStyle">✓</span>
              )}

              <div className="cardHeader">
                {item.img}
              </div>

              <div className="cardDesc">
                <p className='p1'>{item.title}</p>
                <p className='p2'>{item.tIndic}</p>
              </div>
            </div>
          ))}
        </div>

        {comboSelecionado && (
          <div className="variacaoCorBox">
            <h3>VARIAÇÃO DE COR</h3>
            <p>{comboSelecionado.desc}</p>

            <div className="variacaoOptions">
              {comboSelecionado.vaCor.map((cor, index) => (
                <button
                  key={index}
                  className={`corOption ${corSelecionada === cor ? 'selected' : ''}`}
                  onClick={() => setCorSelecionada(cor)}
                >
                  {cor}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className='BtnGerarSimu'>
          <button
            disabled={!comboSelecionado || !corSelecionada}
            onClick={gerarSimulacao}
          >
            Gerar Simulação ✦
          </button>
        </div>

      </div>
    </div>
  )
}

export default Misto
