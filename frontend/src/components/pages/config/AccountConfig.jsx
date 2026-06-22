import './AccountModule.css'
import { useNavigate } from 'react-router-dom'
import back from '../../../images/move-left.png'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

function Config() {
  const navigate = useNavigate()

  const [infoAccount, setInfoAccount] = useState([])
  const [tipoCobranca, setTipoCobranca] = useState('cortesia')
  const [valorSimulacao, setValorSimulacao] = useState('')

  useEffect(() => {
    infoConta()
  }, [])

  async function infoConta() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('L1_LOJA')
      .select('*')
      .eq('L1_EMAIL', user.email)
      .single()

    if (error) {
      console.error('Erro ao buscar conta:', error)
      return
    }

    setInfoAccount(data ? [data] : [])
  }

  return (
    <>
      <div className='ConfigContainer'>
        <div className='ConfigContent'>
          <div className='ConfigHeaderContainer'>
            <div>
              <button className='backView' onClick={() => navigate('/home')}>
                <img src={back} alt='Voltar' />
              </button>
            </div>

            <div className='ConfigHeaderText'>
              <p className='eyebrow'>CONTA</p>
              <h2>Configurações</h2>
            </div>
          </div>

          <div className='infoAccount'>
            {infoAccount.map((info, i) => (
              <div className='infos' key={i}>
                <div className='infosCard2'>
                  <div className='infoLinha'>
                    <span className='infoLabel'>Salão</span>
                    <span className='infoValor'>{info.L1_NOMEL}</span>
                  </div>

                  <div className='infoLinha'>
                    <span className='infoLabel'>Profissional</span>
                    <span className='infoValor'>{info.L1_PROFI}</span>
                  </div>

                  <div className='infoLinha'>
                    <span className='infoLabel'>Email</span>
                    <span className='infoValor'>{info.L1_EMAIL}</span>
                  </div>

                  <div className='infoLinha'>
                    <span className='infoLabel'>Plano Atual</span>
                    <span className='infoValor'>
                      {(() => {
                        if (info.L1_TIPOC === 1) return 'Teste'
                        if (info.L1_TIPOC === 2) return 'Pro'
                        if (info.L1_TIPOC === 3) return 'Pro Max'
                        return 'Desconhecido'
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='infoCobranca'>
            <div className='infos2'>
              <h3 className='cobrasetting'>Cobrança de simulação</h3>

              <p className='muted'>
                Defina se a simulação de IA é oferecida gratuitamente ao cliente
                ou cobrada como serviço à parte.
              </p>

              <button
                type='button'
                className={`billing-option ${tipoCobranca === 'cortesia' ? 'active' : ''}`}
                onClick={() => setTipoCobranca('cortesia')}
              >
                <div className='billing-op'>
                  <div>
                    <span className='billing-icon'>🎁</span>
                  </div>

                  <div>
                    <strong>Cortesia</strong>
                    <p>Gratuita - funciona como ferramenta de venda</p>
                  </div>
                </div>

                {tipoCobranca === 'cortesia' && (
                  <span className='check'>✓</span>
                )}
              </button>

              <button
                type='button'
                className={`billing-option ${tipoCobranca === 'pago' ? 'active' : ''}`}
                onClick={() => setTipoCobranca('pago')}
              >
                <div className='billing-op'>
                  <div>
                    <span className='billing-icon'>💰</span>
                  </div>

                  <div>
                    <strong>Serviço Pago</strong>
                    <p>O cliente paga pela simulação como serviço à parte</p>
                  </div>
                </div>

                {tipoCobranca === 'pago' && (
                  <span className='check'>✓</span>
                )}
              </button>

              {tipoCobranca === 'pago' && (
                <div className='valorBox'>
                  <label>VALOR POR SIMULAÇÃO (R$)</label>

                  <div className='valorInputBox'>
                    <span>R$</span>

                    <input
                      type='number'
                      value={valorSimulacao}
                      onChange={e => setValorSimulacao(e.target.value)}
                      placeholder='0,00'
                    />
                  </div>
                </div>
              )}

              <p className='note-muted'>
                ℹ️ Alterações valem apenas para novos atendimentos — registros
                anteriores não são afetados.
              </p>

              <button className='btn-primary'>
                Salvar Alterações
              </button>

              
            </div>
            <button
                type="button"
                className="BtnVoltarHome"
                onClick={() => navigate('/home')}
              >
                ← Voltar ao Dashboard
              </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Config