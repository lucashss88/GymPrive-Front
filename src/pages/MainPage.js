import React from 'react';
import { Link } from 'react-router-dom';
import fitforge from '../assets/images/fitforge3.png';

const MainPage = () => {
    return (
        <div className="container">
            <h1>Bem-vindo ao GymFit</h1>
            <img src={fitforge} className="img_main"/>
            <div>
                <Link to="/login" className="btn_main btn bg-dark text-white">Login</Link>
                <Link to="/register" className="btn_main btn bg-dark text-white">Registrar</Link>
            </div>
        </div>
    );
};

export default MainPage;
