import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './AtendimentoModule.css'
import back from '../../../images/move-left.png'
import { supabase } from '../../../lib/supabase'

function Atendimento() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState('')

  useEffect(() => {
    buscarClientes()
  }, [])

  async function buscarClientes() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('A3_CLIENTE')
      .select('*')
      .order('A3_NOME', { ascending: true })

    if (error) {
      console.error('Erro ao buscar clientes:', error)
      return
    }

    setClientes(data || [])
  }

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.A3_NOME?.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.A3_CONTATO?.includes(busca)
  )

  return (
    <div className="AtendimentoContainer">
      <div className="AtendimentoContent">

        <div className='ProgressBar'>
          <span className='active'></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="AtendimentoHeader">
          <button
            className="backView"
            onClick={() => navigate('/home')}
          >
            <img src={back} alt="Voltar" />
          </button>

          <div className="AtendimentoHeaderText">
            <p className="eyebrow">ATENDIMENTO • PASSO 1</p>
            <h3>Quem é o cliente?</h3>
          </div>
        </div>

        <div className="AtendimentoSearch">
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

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
                key={cliente.id} onClick={() => navigate('/analise', { state: { cliente } })}
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

        <div className="btn-cont">
          <button
            className="btn-outlin"
            onClick={() => navigate('/cadastrarCli')}
          >
            + Novo cliente
          </button>
        </div>

      </div>
    </div>
  )
}

export default Atendimento