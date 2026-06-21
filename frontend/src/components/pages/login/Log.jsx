import './LogModule.css'
import logo from '../../../images/logo.jpg'

function Log() {
  return (
    <>
      <div className="logContainer">
        <div className='logSize'>
          <div className='logContent'>
            <div className='logColor'>
              <span className="canto-inferior-esquerdo"></span>
              <span className="canto-inferior-direito"></span>

              <img src={logo} alt="logo da empresa" className='logoimg' />
              <div className='mg-ct'>
                <h1><span className='mg-w'>MOR</span><span className='mg-g'>GLOW</span></h1>
              </div>
              <div className='s1-ai'>
                <p><span>— AI —</span></p>
              </div>
              <div className='s1-rule'></div>
              <div className='s1-tag'>
                <p><span>O Futuro da Estética é Inteligente</span></p>
              </div>

              <button className='btn-log'>ENTRAR</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Log
