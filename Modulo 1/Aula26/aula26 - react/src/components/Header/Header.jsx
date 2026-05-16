import { Link } from "react-router-dom"

function Header() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-black" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">Zamigos</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/cadastro">Cadastro</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/perfil">Perfil</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header