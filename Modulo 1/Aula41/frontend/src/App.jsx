import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'
import Cliente from './pages/Cliente'
import Funcionario from './pages/Funcionario'
import RotaProtegida from './Components/RotaProtegida.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/cliente' element={<Cliente/>}/>
        <Route path='/funcionario' element={
          <RotaProtegida tipoPermitido="funcionario">
            <Funcionario/>
          </RotaProtegida>
          }/>
      </Routes>
    </>
  )
}

export default App