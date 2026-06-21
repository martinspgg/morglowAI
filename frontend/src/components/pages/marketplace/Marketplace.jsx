import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import './MarketplaceModule.css'
import { useNavigate } from 'react-router-dom'
import back from '../../../images/move-left.png'

function Marketplace() {
    const navigate = useNavigate()
    const [produtos, setProdutos] = useState([])
    const [filtro, setFiltro] = useState('')
    const [selecionado, setSelecionado] = useState(null)

    useEffect(() => {
        buscarProdutos()
    }, [])

    async function buscarProdutos(filtroAtivo = '') {
        let query = supabase.from('M1_MARKETPLACE').select('*')

        if (filtroAtivo) {
            query = query.ilike('M1_NOME', `%${filtroAtivo}%`)
        }

        const { data } = await query.order('M1_NOME')
        setProdutos(data ?? [])
    }

    function handleFiltro(e) {
        const valor = e.target.value
        setFiltro(valor)
        buscarProdutos(valor)
    }

    return (
        <div className='MarketContainer'>
            <div className='MarketContent'>
                <div className='MarketHeader'>
                    <button className='backView' onClick={() => navigate('/home')}>
                        <img src={back} alt="Voltar" />
                    </button>
                    <div className='MarketHeaderText'>
                        <p className='eyebrow'>MARKETPLACE</p>
                        <h2>Produtos Recomendados</h2>
                    </div>
                </div>

                <input
                    className='MarketFiltro'
                    type="text"
                    placeholder="Filtrar produtos..."
                    value={filtro}
                    onChange={handleFiltro}
                />

                <div className='MarketGrid'>
                    {produtos.map((p, i) => (
                        <div className='MarketCard' key={i} onClick={() => setSelecionado(p)}>
                            <p className='CardTipo'>{p.M1_MARCA}</p>
                            <h3 className='CardNome'>{p.M1_NOME}</h3>
                            <p className='CardDesc'>{p.M1_DESC}</p>
                            <p className='CardValor'>R$ {Number(p.M1_VALOR).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {selecionado && (
                    <div className='ModalOverlay' onClick={() => setSelecionado(null)}>
                        <div className='ModalBox' onClick={e => e.stopPropagation()}>
                            <p className='CardTipo'>{selecionado.M1_TIPO}</p>
                            <h2>{selecionado.M1_NOME}</h2>
                            <p className='CardDesc'>{selecionado.M1_DESC}</p>
                            <p className='CardValor'>R$ {Number(selecionado.M1_VALOR).toFixed(2)}</p>
                            <button className='ModalBtnComprar'>Comprar</button>
                            <button className='ModalBtnFechar' onClick={() => setSelecionado(null)}>Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Marketplace
