import React, { useState } from 'react'

const Cadastro = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [endereco, setEndereco] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [cep, setCep] = useState('')

    function filtrarEmail(valorDigitado) {
        setEmail(valorDigitado)
        console.log(valorDigitado)
    }

    function verificarCep(valorDigitado) {
        setCep(valorDigitado)
        console.log(valorDigitado)
    }

    return (
        <div className='container mt-5' style={{ minHeight: '100vh' }}>
            <h1>Cadastro de novo usuário</h1>
            <div className='row justify-content-center'>
                <div className='col-12 col-md-6'>
                    <form className='row g-3'>
                        <div className='col-md-6'>
                            <label htmlFor='inputEmail4' className='form-label'>Email</label>
                            <input
                                type='email'
                                className='form-control'
                                id='inputEmail4'
                                onChange={(e) => filtrarEmail(e.target.value)}
                            />
                        </div>
                        <div className='col-md-6'>
                            <label htmlFor='inputPassword4' className='form-label'>Password</label>
                            <input
                                type='password'
                                className='form-control'
                                id='inputPassword4'
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                        <div className='col-12'>
                            <label htmlFor='inputAddress' className='form-label'>Address</label>
                            <input
                                type='text'
                                className='form-control'
                                id='inputAddress'
                                placeholder='1234 Main St'
                                onChange={(e) => setEndereco(e.target.value)}
                            />
                        </div>
                        <div className='col-md-6'>
                            <label htmlFor='inputCity' className='form-label'>City</label>
                            <input
                                type='text'
                                className='form-control'
                                id='inputCity'
                                onChange={(e) => setCidade(e.target.value)}
                            />
                        </div>
                        <div className='col-md-4'>
                            <label htmlFor='inputState' className='form-label'>State</label>
                            <select
                                id='inputState'
                                className='form-select'
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value=''>Choose...</option>
                                <option value=''>...</option>
                            </select>
                        </div>
                        <div className='col-md-2'>
                            <label htmlFor='inputZip' className='form-label'>Zip</label>
                            <input
                                type='text'
                                className='form-control'
                                id='inputZip'
                                onChange={(e) => setCep(e.target.value)}
                            />
                        </div>
                        <div className='col-12'>
                            <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='gridCheck' />
                                <label className='form-check-label' htmlFor='gridCheck'>
                                    Check me out
                                </label>
                            </div>
                        </div>
                        <div className='col-12'>
                            <button type='submit' className='btn btn-primary'>Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Cadastro
