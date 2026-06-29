import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')

    const navigate = useNavigate()

    async function fazerLogin(e){
        e.preventDefault()
        let credenciais = {
            cpf:cpf,
            senha:senha
        }
        credenciais = JSON.stringify(credenciais)

        const resposta = await fetch(
            'http://localhost:3000/login',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:credenciais
            }
        )
        const dados = await resposta.json()
        console.log(dados.usuario)

        if(!resposta.ok){
            return {msg:'Resporta inválida'}
        }

        localStorage.setItem('token',dados.token)
        localStorage.setItem('id',dados.usuario.id)
        localStorage.setItem('nome',dados.usuario.nome)
        localStorage.setItem('tipo',dados.usuario.tipo)

        if(dados.usuario.tipo == 'funcionario'){
            navigate('/funcionario')
        }

        if(dados.usuario.tipo == 'cliente'){
            navigate('/cliente')
        }
        
    }

  return (
    <>
    <h1 className='text-center'>Sistema Biblioteca</h1>
    

    <div className='row justify-content-center'>
        <div className='col-6'>
            <h3>Login</h3>
            <form className='' onSubmit={fazerLogin}>
                <div className="mb-3">
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <input onChange={(e)=>{setCpf(e.target.value)}} type="text" className="form-control" id="cpf" name='cpf'/>

                </div>
                <div className="mb-3">
                    <label htmlFor="senha" className="form-label">Senha</label>
                    <input onChange={(e)=>{setSenha(e.target.value)}} type="password" className="form-control" id="senha" name='senha'/>
                </div>
                
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
    
    </>
  )
}

export default Login