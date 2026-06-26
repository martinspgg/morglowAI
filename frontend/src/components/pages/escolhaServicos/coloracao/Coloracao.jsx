import './ColoracaoModule.css'
import { useNavigate } from 'react-router-dom'
import back from '../../../../images/move-left.png'

function Coloracao() {
  const navigate = useNavigate()

  return (
    <div className='ServiceContainer'>
      <div className='ServiceContent'>

        <div className='ProgressBar'>
          <span className='active'></span>
          <span className='active'></span>
          <span className='active'></span>
          <span className='active'></span>
          <span></span>
          <span></span>
        </div>

        <div className="ServiceHeader">
          <button
            className="backView"
            onClick={() => navigate('/service')}
          >
            <img src={back} alt="Voltar" />
          </button>

          <div className="ServiceHeaderText">
            <p className="eyebrow">ATENDIMENTO • PASSO 4</p>
            <h3>Escolha o estilo</h3>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Coloracao
