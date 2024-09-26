import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/Home.css';
import ftb from '../assets/images/FTB@2x.png';

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
            <img src={ftb} className="img_main mb-6"/>
            <h1 className="welcomeText">Bem-vindo, {user.email}!</h1>
            <div className="button-grid">
              <button
                className="home-button btn btn-dark btn-lg"
                onClick={() => navigate('/create-workout')}
              >
                Criar Treino
              </button>
              <button
                className="home-button btn btn-dark btn-lg"
                onClick={() => navigate('/list-workout')}
              >
                Listar Treinos
              </button>
              <button
                className="home-button btn btn-dark btn-lg"
                onClick={() => navigate('/edit-profile')}
              >
                Editar Perfil
              </button>
              <button
                className="btn btn-danger btn-lg home-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
            <h1 className="welcomeText">Carregando...</h1>
        )}
      </div>
    );
};

export default HomePage;
