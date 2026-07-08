// Estado do atendimento em andamento, compartilhado entre as telas do fluxo
// (cliente → foto → serviço → estilo → simulação → resultado).
// sessionStorage: sobrevive a refresh, morre ao fechar a aba.

const CHAVE = 'morglow_atendimento'

function ler() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE)) || {}
  } catch {
    return {}
  }
}

function gravar(dados) {
  sessionStorage.setItem(CHAVE, JSON.stringify(dados))
}

export function setCliente(cliente) {
  gravar({ ...ler(), cliente })
}

export function getCliente() {
  return ler().cliente || null
}

export function setFoto(fotoDataUrl) {
  gravar({ ...ler(), foto: fotoDataUrl })
}

export function getFoto() {
  return ler().foto || null
}

export function setServico(servico) {
  gravar({ ...ler(), servico })
}

export function getServico() {
  return ler().servico || null
}

export function setResultado(resultado) {
  gravar({ ...ler(), resultado })
}

export function getResultado() {
  return ler().resultado || null
}

export function limparAtendimento() {
  sessionStorage.removeItem(CHAVE)
}
