import './HomeModule.css'
import userAccount from '../../../images/user.png'
import closeAccount from '../../../images/undo-2.png'
import { useNavigate } from 'react-router-dom'


function Home(){
    const navigate = useNavigate(); // Inicializa o navegador

    return (
        <>
        <div className="homeContainer">
            <div className='homePainel'>
                <div className='homePainelHeader'>
                    <div className='homePainelText'>
                        <h1><span className='logo-mor'>MOR</span><span className='logo-glow'>GLOW<span className='logo-ai'>AI</span></span></h1>
                        <p className='dash-salon'>Barbearia Nova Era</p>
                    </div>
                    <div className='homePainelOpcoes'>
                        <button onClick={() => navigate('/config')}><img src={userAccount} alt="Configuração de Conta" /></button>
                        <button onClick={() => navigate('/')}><img src={closeAccount} alt="Sair da conta" /></button>
                    </div>
                </div>
                <div className="homePainelContent">
                    <h1 className='dash-greeting'>Olá, Pedro 👋</h1>
                    <p className='muted'>Pronto para o próximo atendimento? </p>
                    <button className='btn-primarydash-cta'>✦ Novo Atendimento</button>
                </div>
                <div className='homePainelHistorico'>
                    <h1>Recentes</h1>
                    <script>
                    </script>
                </div>
                <div className="homePainelRecentes">
                    <button className='btn-historic'>Histórico completo</button>
                    <button className='btn-historic' onClick={() => navigate('/marketplace')}>Marketplace</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home