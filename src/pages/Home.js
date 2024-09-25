import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/Home.css'; 

const HomePage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            console.log('Logout bem-sucedido!');
            navigate('/');
        } catch (error) {
            console.error('Erro ao tentar fazer logout', error);
        }
    };

    return (
        <div className="container">
            {user ? (
                <>
                    <h1 className="welcomeText">Bem-vindo, {user.email}!</h1>
                    <div className="button-grid">
                        <button
                            className="home-button"
                            onClick={() => navigate('/create-workout')}
                        >
                            Criar Treino
                        </button>

                        <button
                            className="home-button"
                            onClick={() => navigate('/list-workout')}
                        >
                            Listar Treinos
                        </button>

                        <button
                            className="home-button"
                            onClick={() => navigate('/edit-profile')}
                        >
                            Editar Perfil
                        </button>
                        
                    </div>
                    <button
                        className="bg-danger home-button mt-3"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </>
            ) : (
                <h1 className="welcomeText">Carregando...</h1>
            )}
        </div>
    );
};

export default HomePage;
