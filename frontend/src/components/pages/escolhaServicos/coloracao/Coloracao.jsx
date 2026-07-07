import './ColoracaoModule.css'
import { useNavigate } from 'react-router-dom'
import back from '../../../../images/move-left.png'
import { useState } from 'react'

function Coloracao() {
  const navigate = useNavigate()

  const [coloracaoSelecionada, setColoracaoSelecionada] = useState(null)
  const [tonalidadeSelecionada, setTonalidadeSelecionada] = useState('')

  const coloracoes = [
    {
      img: '',
      title: 'Loiro Californiano',
      tIndic: 'Visual moderno e iluminado',
      desc: 'Iluminação gradual nas pontas para um efeito natural.',
      variacoes: ['Mel', 'Dourado', 'Platinado']
    },
    {
      img: '',
      title: 'Moreno Iluminado',
      tIndic: 'Elegante e discreto',
      desc: 'Luzes suaves preservando a cor natural.',
      variacoes: ['Chocolate', 'Avelã', 'Canela']
    },
    {
      img: '',
      title: 'Platinado',
      tIndic: 'Visual marcante',
      desc: 'Descoloração total com acabamento prateado.',
      variacoes: ['Branco', 'Cinza', 'Prata']
    },
    {
      img: '',
      title: 'Coloração Global',
      tIndic: 'Mudança completa',
      desc: 'Coloração uniforme em todo o cabelo.',
      variacoes: ['Preto', 'Castanho', 'Ruivo']
    },
    {
      img: '',
      title: 'Reflexo Natural',
      tIndic: 'Leve iluminação',
      desc: 'Realce sutil da cor natural do cabelo.',
      variacoes: ['Mel', 'Caramelo', 'Champagne']
    }
  ]

  function selecionarColoracao(item) {
    setColoracaoSelecionada(item)
    setTonalidadeSelecionada('')
  }

  function gerarSimulacao() {
    if (!coloracaoSelecionada || !tonalidadeSelecionada) return

    navigate('/simulacao', {
      state: {
        estilo: coloracaoSelecionada,
        tonalidade: tonalidadeSelecionada
      }
    })
  }

  return (
    <div className='ColoracaoContainer'>
      <div className='ColoracaoContent'>

        <div className='ColoracaoProgress'>
          <span className='active'></span>
          <span className='active'></span>
          <span className='active'></span>
          <span className='active'></span>
          <span></span>
          <span></span>
        </div>

        <div className="ColoracaoHeader">
          <button
            className="ColoracaoBack"
            onClick={() => navigate('/service')}
          >
            <img src={back} alt="Voltar" />
          </button>

          <div className="ColoracaoHeaderText">
            <p className="ColoracaoEyebrow">
              ATENDIMENTO • PASSO 4
            </p>

            <h3>Escolha a coloração</h3>
          </div>
        </div>

        <div className="ColoracaoGrid">
          {coloracoes.map((item, index) => (
            <div
              key={index}
              className={`ColoracaoCard ${
                coloracaoSelecionada?.title === item.title ? 'selected' : ''
              }`}
              onClick={() => selecionarColoracao(item)}
            >
              {coloracaoSelecionada?.title === item.title && (
                <span className="ColoracaoCheck">
                  ✓
                </span>
              )}

              <div className="ColoracaoImagem">
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.title}
                  />
                )}
              </div>

              <div className="ColoracaoInfo">
                <p className="ColoracaoTitulo">
                  {item.title}
                </p>

                <p className="ColoracaoDescricao">
                  {item.tIndic}
                </p>
              </div>
            </div>
          ))}
        </div>

        {coloracaoSelecionada && (
          <div className="ColoracaoPainel">

            <h3 className="ColoracaoPainelTitulo">
              TONALIDADE
            </h3>

            <p className="ColoracaoPainelTexto">
              {coloracaoSelecionada.desc}
            </p>

            <div className="ColoracaoOpcoes">
              {coloracaoSelecionada.variacoes.map((cor, index) => (
                <button
                  key={index}
                  className={`ColoracaoChip ${
                    tonalidadeSelecionada === cor ? 'selected' : ''
                  }`}
                  onClick={() => setTonalidadeSelecionada(cor)}
                >
                  {cor}
                </button>
              ))}
            </div>

          </div>
        )}

        <div className="ColoracaoBotao">
          <button
            disabled={!coloracaoSelecionada || !tonalidadeSelecionada}
            onClick={gerarSimulacao}
          >
            Gerar Simulação ✦
          </button>
        </div>

      </div>
    </div>
  )
}

export default Coloracao