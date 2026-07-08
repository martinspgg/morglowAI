import './BarbaModule.css'
import { useNavigate } from 'react-router-dom'
import back from '../../../../images/move-left.png'
import { useState } from 'react'
import BuscaEstiloWeb from '../../../shared/BuscaEstiloWeb.jsx'

function Barba() {
  const navigate = useNavigate()

  const [estiloSelecionado, setEstiloSelecionado] = useState(null)
  const [variacaoSelecionada, setVariacaoSelecionada] = useState('')

  const estilos = [
    {
      img: '',
      title: 'Barba Cheia',
      tIndic: 'Rosto oval, triangular — fio denso',
      desc: 'Volume completo com contornos definidos no pescoço e bochechas.',
      vaCor: ['Natural', 'Aparada média', 'Longa modelada']
    },
    {
      img: '',
      title: 'Degradê de Barba',
      tIndic: 'Todos os formatos — transição com o corte',
      desc: 'Fade nas laterais conectando a barba ao cabelo com suavidade.',
      vaCor: ['Baixo', 'Médio', 'Alto']
    },
    {
      img: '',
      title: 'Stubble (Por Fazer)',
      tIndic: 'Rosto redondo, oval — visual despojado',
      desc: 'Barba rente e uniforme com contornos limpos.',
      vaCor: ['Rente', 'Curta', 'Média']
    },
    {
      img: '',
      title: 'Cavanhaque',
      tIndic: 'Rosto redondo — alonga o queixo',
      desc: 'Queixo e bigode conectados, bochechas limpas.',
      vaCor: ['Clássico', 'Vandyke', 'Circle beard']
    },
    {
      img: '',
      title: 'Barba Desenhada',
      tIndic: 'Rosto quadrado, oval — linhas marcadas',
      desc: 'Contornos geométricos precisos com acabamento de navalha.',
      vaCor: ['Linhas retas', 'Curvas suaves', 'Minimalista']
    }
  ]

  function selecionarEstilo(item) {
    setEstiloSelecionado(item)
    setVariacaoSelecionada('')
  }

  function gerarSimulacao() {
    if (!estiloSelecionado || !variacaoSelecionada) return

    navigate('/simulacao', {
      state: {
        estilo: estiloSelecionado,
        variacao: variacaoSelecionada
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
            <h3>Escolha a barba</h3>
          </div>
        </div>

        <BuscaEstiloWeb
          contexto="beard"
          placeholder="Buscar estilo de barba na web..."
          variacoesPadrao={['Natural', 'Aparada', 'Cheia']}
          selecionadoId={estiloSelecionado?.webId}
          onSelecionar={selecionarEstilo}
        />

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
            <h3>VARIAÇÃO DE ESTILO</h3>
            <p>{estiloSelecionado.desc}</p>

            <div className="variacaoOptions">
              {estiloSelecionado.vaCor.map((variacao, index) => (
                <button
                  key={index}
                  className={`corOption ${variacaoSelecionada === variacao ? 'selected' : ''}`}
                  onClick={() => setVariacaoSelecionada(variacao)}
                >
                  {variacao}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className='BtnGerarSimu'>
          <button
            disabled={!estiloSelecionado || !variacaoSelecionada}
            onClick={gerarSimulacao}
          >
            Gerar Simulação ✦
          </button>
        </div>

      </div>
    </div>
  )
}

export default Barba
