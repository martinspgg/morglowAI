import { useParams, Navigate } from 'react-router-dom'
import CorteCabelo from './corteCabelo/CorteCabelo.jsx'
import Coloracao from './coloracao/Coloracao.jsx'
import Barba from './barba/Barba.jsx'
import CorteBarba from './corteEbarba/Misto.jsx'

function Estilo() {
  const { servico } = useParams()

  if (servico === 'corte') {
    return <CorteCabelo />
  }

  if (servico === 'coloracao') {
    return <Coloracao/>
  }

  if (servico === 'barba') {
    return <Barba/>
  }

  if (servico === 'corte-barba') {
    return <CorteBarba/>
  }

  return <Navigate to="/service" replace />
}

export default Estilo