import logo from '../../../images/logo.jpg'
import './LogModule.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

function Log() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin() {
    setErro('')
    setCarregando(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setCarregando(false)
    if (error) {
      setErro('E-mail ou senha incorretos.')
      return
    }
    navigate('/home')
  }

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

              <input
                className='input-log'
                type='email'
                placeholder='E-mail'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                className='input-log'
                type='password'
                placeholder='Senha'
                value={senha}
                onChange={e => setSenha(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />

              {erro && <p className='log-erro'>{erro}</p>}

              <button className='btn-log' onClick={handleLogin} disabled={carregando}>
                {carregando ? 'ENTRANDO...' : 'ENTRAR'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Log
