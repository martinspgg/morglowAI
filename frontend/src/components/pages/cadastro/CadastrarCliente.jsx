import './CadastrarClienteModule.css'
import back from '../../../images/move-left.png'
import { supabase } from '../../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function CadastrarCli() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [autorizacao, setAutorizacao] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function iniciarAtendimento(e) {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('Informe o nome do cliente.')
      return
    }

    if (!telefone.trim()) {
      setErro('Informe o telefone do cliente.')
      return
    }

    if (!email.trim()) {
      setErro('Informe o e-mail do cliente.')
      return
    }

    try {
      setCarregando(true)

      const { data: clienteExistente } = await supabase
        .from('A3_CLIENTE')
        .select('*')
        .eq('A3_CONTATO', telefone)
        .maybeSingle()

      if (clienteExistente) {
        setErro('Já existe um cliente com este telefone.')
        return
      }

      const { error } = await supabase
        .from('A3_CLIENTE')
        .insert({
          A3_NOME: nome,
          A3_CONTATO: telefone,
          A3_EMAIL: email,
          A3_NATEND: 0
        })

      if (error) throw error

      navigate('/atendimento')
    } catch (err) {
      console.error(err)
      setErro('Erro ao cadastrar cliente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="CadastroContainer">
      <div className="CadastroContent">

        <div className="CadastroHeader">
          <button
            className="backView"
            onClick={() => navigate('/atendimento')}
          >
            <img src={back} alt="Voltar" />
          </button>

          <div className="CadastroHeaderText">
            <p className="eyebrow">ATENDIMENTO · PASSO 1</p>
            <h3>Quem é o cliente?</h3>
          </div>
        </div>

        <form className="CadastroForm" onSubmit={iniciarAtendimento}>
          <div className="FormGroup">
            <label>Nome *</label>
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="FormGroup">
            <label>Telefone *</label>
            <input
              type="text"
              placeholder="(11) 99999-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div className="FormGroup">
            <label>E-mail *</label>
            <input
              type="email"
              placeholder="cliente@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label className="CheckBoxCard">
            <input
              type="checkbox"
              checked={autorizacao}
              onChange={(e) => setAutorizacao(e.target.checked)}
            />
            <span>
              O cliente autoriza o uso de sua imagem para simulação estética
              dentro deste atendimento (LGPD — Lei nº 13.709/2018).
            </span>
          </label>

          {erro && <p className="ErroCadastro">{erro}</p>}

          <button
            type="submit"
            className="BtnIniciar"
            disabled={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar Cliente'}
          </button>

          <button
            type="button"
            className="BtnVoltarBusca"
            onClick={() => navigate('/atendimento')}
          >
            ← Voltar à busca
          </button>
        </form>

      </div>
    </div>
  )
}

export default CadastrarCli