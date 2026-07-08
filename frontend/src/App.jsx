import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/pages/login/Log.jsx'
import Home from './components/pages/home/Home.jsx'
import Marketplace from './components/pages/marketplace/Marketplace.jsx'
import Configuracoes from './components/pages/config/AccountConfig.jsx'
import Atendimento from './components/pages/atendimento/Atendimento.jsx'
import CadastroCL from './components/pages/cadastro/CadastrarCliente.jsx'
import Analise from "./components/pages/analise/Analise.jsx"
import CapturaFacial from './components/pages/capturaFacial/CapturaFacial.jsx'
import Service from './components/pages/servicos/Service.jsx'
import Estilo from './components/pages/escolhaServicos/Estilo.jsx'
import Historico from './components/pages/historico/Historico.jsx'
import Simulacao from './components/pages/simulacao/Simulacao.jsx'
import Resultado from './components/pages/resultado/Resultado.jsx'

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota inicial que carrega a sua tela de login */}
        <Route path="/" element={<Login />} />

        {/* Rota para onde o usuário vai ao clicar em ENTRAR */}
        <Route path="/home" element={<Home />} />

        {/* Rota para onde o usuário vai ao clicar em Marketplace */}
        <Route path='/marketplace' element={<Marketplace />} />

        {/* Rota para o usúario vai ao clicar em Configurações */}
        <Route path='/config' element={<Configuracoes />} />

        {/* Rota para o usúario vai ao clicar em Novo Atendimento */}
        <Route path='/atendimento' element={<Atendimento />} />

        {/* Rota para o usúario vai ao clicar em Novo Cliente */}
        <Route path='/cadastrarCli' element={<CadastroCL />} />

        {/* Rota para o usúario vai ao clicar em um cliente existente */}
        <Route path='/analise' element={<Analise />} />

        {/* Rota para o usúario vai ao clicar em iniciar analise */}
        <Route path='/captura' element={<CapturaFacial />} />

        {/* Rota para o usúario vai ao clicar em Confirmar e continuar análise */}
        <Route path='/service' element={<Service />} />

        {/* Rota para o usúario vai ao clicar em Corte de Cabelo */}
        <Route path="/estilo/:servico" element={<Estilo />} />

        {/* Rota para o usúario vai ao clicar em Histórico completo */}
        <Route path="/historico" element={<Historico />} />

        {/* Rota para o usúario vai ao clicar em Gerar Simulação (Tela 04 — Processamento IA) */}
        <Route path="/simulacao" element={<Simulacao />} />

        {/* Rota do resultado antes/depois (Tela 05) */}
        <Route path="/resultado" element={<Resultado />} />
      </Routes>
    </Router>
  )
}

export default App
