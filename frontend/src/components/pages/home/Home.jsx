import './HomeModule.css'
import userAccount from '../../../images/user.png'
import closeAccount from '../../../images/undo-2.png'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

function Home() {
    const navigate = useNavigate()

    const [infoAccount, setInfoAccount] = useState([])
    const [recentes, setRecentes] = useState([])

    async function buscarRecentes() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('A3_CLIENTE')
            .select('*')
            .gt('A3_NATEND', 0)
            .order('id', { ascending: false })
            .limit(4)

        if (error) {
            console.error('Erro ao buscar clientes recentes:', error)
            return
        }

        setRecentes(data || [])
    }

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

    useEffect(() => {
        infoConta()
        buscarRecentes()
    }, [])

    return (
        <div className="homeContainer">
            <div className="homePainel">

                <div className="homePainelHeader">
                    <div className="homePainelText">
                        <h1>
                            <span className="logo-mor">MOR</span>
                            <span className="logo-glow">GLOW</span>
                            <span className="logo-ai">AI</span>
                        </h1>

                        <div className="homeInfoAccount">
                            {infoAccount.map((info, i) => (
                                <div className="homePainelInfo" key={i}>
                                    <h1>
                                        {info.L1_NOMEL}
                                    </h1>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="homePainelOpcoes">
                        <button onClick={() => navigate('/config')}>
                            <img src={userAccount} alt="Configuração de Conta" />
                        </button>

                        <button onClick={() => navigate('/')}>
                            <img src={closeAccount} alt="Sair da conta" />
                        </button>
                    </div>
                </div>

                <div className='infoAccounts'>
                    {infoAccount.map((info, i) => (
                        <div className="homePainelContent" key={i}>
                            <h1 className="dash-greeting">Olá,
                                {(() => {
                                    if (info.L1_PROFI === 'Administrador')
                                        return <span className='admin-re'> Administrador</span>
                                    return <span> {info.L1_PROFI}</span>
                                })()}
                                👋</h1>
                            <p className="muted">Pronto para o próximo atendimento?</p>

                            <button
                                className="btn-primarydash-cta"
                                onClick={() => navigate('/atendimento')}
                            >
                                ✦ Novo Atendimento
                            </button>
                        </div>
                    ))}
                </div>

                <div className="homePainelHistorico">
                    <h2>Recentes</h2>
                </div>

                <div className="homeRecentesLista">
                    {recentes.length === 0 && (
                        <p className="homeRecentesVazio">Nenhum cliente atendido ainda.</p>
                    )}

                    {recentes.map((cliente) => {
                        const iniciais = cliente.A3_NOME
                            ?.split(' ')
                            .slice(0, 2)
                            .map(nome => nome[0])
                            .join('')
                            .toUpperCase()

                        return (
                            <div
                                className="homeRecenteCard"
                                key={cliente.id}
                                onClick={() => navigate('/analise', { state: { cliente } })}
                            >
                                <div className="homeRecenteAvatar">
                                    {iniciais}
                                </div>

                                <div className="homeRecenteInfo">
                                    <span className="homeRecenteNome">
                                        {cliente.A3_NOME}
                                    </span>
                                    <span className="homeRecenteAtend">
                                        {cliente.A3_NATEND || 0} atendimento(s)
                                    </span>
                                </div>

                                <span className="homeRecenteArrow">›</span>
                            </div>
                        )
                    })}
                </div>

                <div className="homePainelRecentes">
                    <button
                        className="btn-historic"
                        onClick={() => navigate('/historico')}
                    >
                        Histórico completo
                    </button>

                    <button
                        className="btn-historic"
                        onClick={() => navigate('/marketplace')}
                    >
                        Marketplace
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Home