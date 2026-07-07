import './CorteCabeloModule.css'
import { useNavigate } from 'react-router-dom'
import back from '../../../../images/move-left.png'
import { useState } from 'react'

function CorteCabelo() {
  const navigate = useNavigate()

  const [estiloSelecionado, setEstiloSelecionado] = useState(null)
  const [corSelecionada, setCorSelecionada] = useState('')

  const estilos = [
    {
      img: '',
      title: 'Degradê Moderno',
      tIndic: 'Oval, Quadrado — fio médio a grosso',
      desc: 'Fade progressivo nas laterais, topo com movimento e textura.',
      vaCor: ['Natural', 'Loiro californiano', 'Castanho com luzes']
    },
    {
      img: '',
      title: 'Corte Clássico',
      tIndic: 'Todos os formatos — versátil',
      desc: 'Lateral curta, topo texturizado, repartido definido.',
      vaCor: ['Natural', 'Castanho', 'Preto natural']
    },
    {
      img: '',
      title: 'Undercut Moderno',
      tIndic: 'Oval, Losango — simétrico',
      desc: 'Lateral raspada, topo longo com queda natural.',
      vaCor: ['Natural', 'Ombré', 'Balayage']
    },
    {
      img: '',
      title: 'Fade Texturizado',
      tIndic: 'Redondo, Oval — cabelo crespo/ondulado',
      desc: 'Degradê alto com topo afro ou crespo valorizado.',
      vaCor: ['Natural', 'Glossagem', 'Reflexo suave']
    },
    {
      img: '',
      title: 'Natural Otimizado',
      tIndic: 'Todos — especialmente fio fino',
      desc: 'Corte que valoriza o crescimento natural.',
      vaCor: ['Natural', 'Glossagem', 'Reflexo suave']
    }
  ]

  function selecionarEstilo(item) {
    setEstiloSelecionado(item)
    setCorSelecionada('')
  }

  function gerarSimulacao() {
    if (!estiloSelecionado || !corSelecionada) return

    navigate('/simulacao', {
      state: {
        estilo: estiloSelecionado,
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
            <h3>Escolha o estilo</h3>
          </div>
        </div>

        <div className="estilosCards">
          {estilos.map((item, index) => (
            <div
              className={`card ${estiloSelecionado?.title === item.title ? 'selected' : ''}`}
              key={index}
              onClick={() => selecionarEstilo(item)}
            >
              {estiloSelecionado?.title === item.title && (
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

        {estiloSelecionado && (
          <div className="variacaoCorBox">
            <h3>VARIAÇÃO DE COR</h3>
            <p>{estiloSelecionado.desc}</p>

            <div className="variacaoOptions">
              {estiloSelecionado.vaCor.map((cor, index) => (
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
            disabled={!estiloSelecionado || !corSelecionada}
            onClick={gerarSimulacao}
          >
            Gerar Simulação ✦
          </button>
        </div>

      </div>
    </div>
  )
}

export default CorteCabelo