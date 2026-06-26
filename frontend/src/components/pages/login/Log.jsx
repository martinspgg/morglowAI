import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import logomorglow from '../../../images/LOGOMORGLOW.png'
import './LogModule.css'

const PHRASES = ['TESTE A NOSSA IA', 'SISTEMA INOVADOR']
const INTERVAL_MS = 10000
const FADE_MS = 700

function Log() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState('in')

  useEffect(() => {
    const timer = setInterval(() => {
      setFade('out')
      setTimeout(() => {
        setIdx(i => (i + 1) % PHRASES.length)
        setFade('in')
      }, FADE_MS)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

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
    <div className="lp-root">

      {/* ── PAINEL ESQUERDO ── */}
      <div className="lp-left">
        <div className="lp-rect-1" />
        <div className="lp-rect-2" />

        <div className="lp-stripes">
          <span /><span /><span />
        </div>

        <div className="lp-logo-wrap">
          <img src={logomorglow} alt="MorGlow" className="lp-logo-img" />
        </div>

        <div key={idx} className={`lp-phrase lp-phrase-${fade}`}>
          <p className="lp-phrase-main">{PHRASES[idx]}</p>
          <p className="lp-phrase-ghost" aria-hidden="true">{PHRASES[idx]}</p>
        </div>
      </div>

      {/* ── PAINEL DIREITO ── */}
      <div className="lp-right">
        <div className="lp-card-wrapper">

          <div className="lp-avatar">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4.5" strokeWidth="1.4" />
              <path d="M3 21c0-4.5 4-8 9-8s9 3.5 9 8" strokeWidth="1.4" />
            </svg>
          </div>

          <div className="lp-card">
            <p className="lp-label">Email</p>
            <div className="lp-field">
              <svg className="lp-field-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <input
                className="lp-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <p className="lp-label lp-label-mt">Senha</p>
            <div className="lp-field">
              <svg className="lp-field-icon" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <input
                className="lp-input"
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {erro && <p className="lp-erro">{erro}</p>}

            <button className="lp-btn" onClick={handleLogin} disabled={carregando}>
              {carregando ? 'ENTRANDO...' : 'ENTRAR'}
            </button>

            <p className="lp-create">Não tem conta? Crie uma</p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Log
