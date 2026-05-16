import React from "react";
import ListarUsuarios from "../../components/ListarUsuarios/ListarUsuarios";
import './Home.css'

function Home() {
    return (
        <>
            <main className="main-home">
                <div className="container mt-4">
                    <div className="row">
                        <h1 className='text-center'>Zamigos</h1>
                        <h3 className='text-center'>Faça amizades e descubra novos hobbies</h3>
                        <ListarUsuarios />
                    </div>
                </div>
            </main>
        </>
    )
}
export default Home;