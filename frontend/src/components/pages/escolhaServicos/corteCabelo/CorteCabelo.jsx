import './CorteCabeloModule.css'
import { useNavigate } from 'react-router-dom'
import back from '../../../../images/move-left.png'

function CorteCabelo() {
    const navigate = useNavigate()

    const estilo = [
        {
            "img": "",
            "title": 'Degradê Moderno',
            "tIndic": 'Oval, Quadrado - Fio médio a grosso',
            "desc": 'Fade progressivo nas laterais, topo com movimento e textura.',
            "vaCor": ["Natural", "Loiro Californiano", "Castanho com Luzes"]
        },
        {
            "img": "",
            "title": 'Undercut Moderno',
            "tIndic": 'Oval, Losango - Simétrico',
            "desc": 'Lateral raspada, topo longo com queda natural.',
            "vaCor": ["Natural", "Ombré", "Balayage"]

        },
        {
            "img": "",
            "title": 'Natural Otimizado',
            "tIndic": 'Todos - Especialmente Fio fino',
            "desc": 'Corte que valoriza o crescimento natural.',
            "vaCor": ["Natural", "Glossagem", "Reflexo Suave"]
        }
    ]

    return (
        <div className='cabeloContainer'>
            <div className='cabeloContent'>

                <div className='ProgressBar'>
                    <span className='active'></span>
                    <span className='active'></span>
                    <span className='active'></span>
                    <span className='active'></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="cabeloHeader">
                    <button
                        className="backView"
                        onClick={() => navigate('/service')}
                    >
                        <img src={back} alt="Voltar" />
                    </button>

                    <div className="cabeloHeaderText">
                        <p className="eyebrow">ATENDIMENTO • PASSO 4</p>
                        <h3>Escolha o estilo</h3>
                    </div>
                </div>

                <div className="estilosCards">
                    {estilo.map((item, index) => (
                        <div className="card" key={index}>
                            <div className="cardHeader">
                                {item.img}
                            </div>
                            <div className="cardDesc">
                                <p className='p1'>{item.title}</p>
                                <p className='p2'>{item.tIndic}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default CorteCabelo