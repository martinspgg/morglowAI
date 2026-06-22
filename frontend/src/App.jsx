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
      </Routes>
    </Router>
  )
}

export default App
