import React, { useEffect, useState } from 'react'
import './Perfil.css'

function Perfil() {
    const [usuario, setUsuario] = useState(null)

    useEffect(() => {
        fetch('https://randomuser.me/api/')
            .then((response) => response.json())
            .then((user) => {
                setUsuario(user.results[0])
            })
            .catch((error) => {
                console.error('Erro ao carregar usuário:', error)
            })
    }, [])

    if (!usuario) {
        return <div className='my-4'>Carregando perfil...</div>
    }

    return (
        <div style={{height: '600px'}} className='row perfil-card align-items-center justify-content-center'>
            <div className='col-12 col-md-4 col-6 '>
                <img    
                    style={{ height: '250px', width: '100%' }}
                    src={usuario.picture.large}
                    className='card-img-top object-fit-contain '
                    alt={`${usuario.name.first} ${usuario.name.last}`}
                />
            </div>
            <div style={{maxWidth: '350px'}} className='col-12 col-md-8 col-6 '>
                <h1 className='fs-1 fw-bold'>Perfil</h1>
                <p><strong>Nome:</strong> {usuario.name.first} {usuario.name.last}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Telefone:</strong> {usuario.phone}</p>
                <p><strong>Usuário:</strong> {usuario.login.username}</p>
                <p><strong>Endereço:</strong> {usuario.location.city}, {usuario.location.state}</p>
            </div>
        </div>
    )
}

export default Perfil
