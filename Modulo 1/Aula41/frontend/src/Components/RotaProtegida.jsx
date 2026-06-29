import React from 'react'
import { Navigate } from 'react-router-dom'

const RotaProtegida = ({children, tipoPermitido}) => {
    const token = localStorage.getItem('token')
    const tipoUsuario = localStorage.getItem('tipo')
    if(!token){
        return <Navigate to='/login' replace/>
    }
    if(tipoPermitido != tipoUsuario){
        return <Navigate to='/login' replace/>
    }
    return children
}

export default RotaProtegida