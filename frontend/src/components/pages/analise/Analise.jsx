import './AnaliseModule.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

function Analise() {
    const navigate = useNavigate()
    const location = useLocation()

    const cliente = location.state?.cliente

    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState('')

    async function finalizarAnalise() {
        navigate('/captura')
        setErro('')

        if (!cliente) {
            setErro('Nenhum cliente selecionado.')
            return
        }

        try {
            setCarregando(true)

            const { error } = await supabase
                .from('A3_ATENDIMENTOS')
                .insert({
                    cliente_id: cliente.id,
                    A3_NOME: cliente.A3_NOME,
                    A3_CONTATO: cliente.A3_CONTATO
                })

            if (error) throw error

            await supabase
                .from('A3_CLIENTE')
                .update({
                    A3_NATEND: Number(cliente.A3_NATEND || 0) + 1
                })
                .eq('id', cliente.id)

            navigate('/home')
        } catch (err) {
            console.error(err)
            setErro('Erro ao salvar atendimento.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="AnaliseContainer">
            <div className="AnaliseContent">

                <div className="AnaliseHeader">
                    <h1 className="AnaliseLogo">
                        <span className="logoMor">MOR</span>
                        <span className="logoGlow">GLOW</span>
                        <span className="logoAi">AI</span>
                    </h1>

                    <h2 className="AnaliseTitulo">
                        Bem-vindo ao
                        <br />
                        MORGLOW AI
                    </h2>

                    <p className="AnaliseSubtitulo">
                        Seu Consultor Estético Digital
                    </p>
                </div>

                <div className="Analiseinfos">
                    <div className="btn-primary-analis">
                        <div className='btn-primary-img'>📸</div>
                        <div>
                            <strong>Captura facial</strong>
                            <p>Fotografamos o rosto para análise precisa.</p>
                        </div>
                    </div>

                    <div className="btn-primary-analis">
                        <div className='btn-primary-img'>🤖</div>
                        <div>
                            <strong>IA em ação</strong>
                            <p>A IA gera a simulação preservando sua identidade.</p>
                        </div>
                    </div>

                    <div className="btn-primary-analis">
                        <div className='btn-primary-img'>✨</div>
                        <div>
                            <strong>Veja antes de decidir</strong>
                            <p>Explore estilos sem cortar um fio sequer.</p>
                        </div>
                    </div>
                </div>

                <div className="AnaliseFooter">
                    <p>
                        Atendendo:{' '}
                        <strong>{cliente ? cliente.A3_NOME : 'Cliente não selecionado'}</strong>
                    </p>

                    {erro && <p className="AnaliseErro">{erro}</p>}

                    <button
                        className="BtnFinalizarAnalise"
                        onClick={finalizarAnalise}
                        disabled={carregando}
                    >
                        {carregando ? 'Iniciando...' : 'Iniciar Análise →'}
                    </button>

                    <button
                        className="BtnVoltarAnalise"
                        onClick={() => navigate('/atendimento')}
                    >
                        ← Voltar
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Analise