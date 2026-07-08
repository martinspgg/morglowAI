import './ServiceModule.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import back from '../../../images/move-left.png'
import { setServico as salvarServico } from '../../../lib/atendimentoFlow'

function Service() {
  const navigate = useNavigate()
  const [servico, setServico] = useState('')

  return (
    <div className='ServiceContainer'>
      <div className='ServiceContent'>

        <div className='ProgressBar'>
          <span className='active'></span>
          <span className='active'></span>
          <span className='active'></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="ServiceHeader">
          <button
            className="backView"
            onClick={() => navigate('/captura')}
          >
            <img src={back} alt="Voltar" />
          </button>

          <div className="ServiceHeaderText">
            <p className="eyebrow">ATENDIMENTO • PASSO 3</p>
            <h3>Qual serviço?</h3>
          </div>
        </div>

        <p className='ServiceDescription'>
          Selecione o tipo de transformação para simular.
        </p>

        <div className='ServiceGrid'>
          <button
            className={`ServiceCard ${servico === 'corte' ? 'selected' : ''}`}
            onClick={() => setServico('corte')}
          >
            <span className='ServiceIcon'>✂️</span>
            <strong>Corte de Cabelo</strong>
          </button>

          <button
            className={`ServiceCard ${servico === 'coloracao' ? 'selected' : ''}`}
            onClick={() => setServico('coloracao')}
          >
            <span className='ServiceIcon'>🎨</span>
            <strong>Coloração</strong>
          </button>

          <button
            className={`ServiceCard ${servico === 'barba' ? 'selected' : ''}`}
            onClick={() => setServico('barba')}
          >
            <span className='ServiceIcon'>🪒</span>
            <strong>Barba</strong>
          </button>

          <button
            className={`ServiceCard ${servico === 'corte-barba' ? 'selected' : ''}`}
            onClick={() => setServico('corte-barba')}
          >
            <span className='ServiceIcon'>✂️ 🪒</span>
            <strong>Corte + Barba</strong>
          </button>
        </div>

        <button
          className='BtnEscolherEstilo'
          disabled={!servico}
          onClick={() => {
            salvarServico(servico)
            navigate(`/estilo/${servico}`)
          }}
        >
          Escolher estilo →
        </button>

      </div>
    </div>
  )
}

export default Service