import './HistoricoModule.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import back from '../../../images/move-left.png'
import { supabase } from '../../../lib/supabase'

function Historico() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)

  async function buscarClientes() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('A3_CLIENTE')
      .select('*')
      .gt('A3_NATEND', 0)
      .order('id', { ascending: false })

    setCarregando(false)

    if (error) {
      console.error('Erro ao buscar histórico:', error)
      return
    }

    setClientes(data || [])
  }

  useEffect(() => {
    buscarClientes()
  }, [])

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.A3_NOME?.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.A3_CONTATO?.includes(busca)
  )

  return (
    <div className="HistoricoContainer">
      <div className="HistoricoContent">

        <div className="HistoricoHeader">
          <button
            className="backView"
            onClick={() => navigate('/home')}
          >
            <img src={back} alt="Voltar" />
          </button>

          <div className="HistoricoHeaderText">
            <p className="eyebrow">HISTÓRICO</p>
            <h3>Clientes atendidos</h3>
          </div>
        </div>

        <div className="HistoricoSearch">
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {carregando && (
          <p className="HistoricoStatus">Carregando clientes...</p>
        )}

        {!carregando && clientesFiltrados.length === 0 && (
          <p className="HistoricoStatus">Nenhum cliente encontrado.</p>
        )}

        <div className="ClienteGrid">
          {clientesFiltrados.map((cliente) => {
            const iniciais = cliente.A3_NOME
              ?.split(' ')
              .slice(0, 2)
              .map(nome => nome[0])
              .join('')
              .toUpperCase()

            return (
              <div
                className="ClienteCard"
                key={cliente.id}
                onClick={() => navigate('/analise', { state: { cliente } })}
              >
                <div className="ClienteAvatar">
                  {iniciais}
                </div>

                <div className="ClienteInfo">
                  <span className="CardNome">
                    {cliente.A3_NOME}
                  </span>

                  <span className="CardTelefone">
                    {cliente.A3_CONTATO}
                  </span>

                  <span className="CardAtendimentos">
                    {cliente.A3_NATEND || 0} atendimento(s)
                  </span>
                </div>

                <span className="ClienteArrow">
                  ›
                </span>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          className="BtnVoltarHome"
          onClick={() => navigate('/home')}
        >
          ← Voltar à Home
        </button>

      </div>
    </div>
  )
}

export default Historico
