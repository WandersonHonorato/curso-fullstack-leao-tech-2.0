import Home from '../src/pages/Home/Home'
import Header from '../src/components/Header/Header'
import Perfil from '../src/pages/Perfil/Perfil'
import Footer from '../src/components/Footer/Footer'
import Cadastro from '../src/pages/Cadastro/Cadastro'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/perfil' element={<Perfil />} />
          <Route path='/cadastro' element={<Cadastro />} />
        </Routes>
      </BrowserRouter>
      <Footer/>
    </>
  )
}
export default App
