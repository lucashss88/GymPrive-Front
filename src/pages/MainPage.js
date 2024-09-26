import React from 'react';
import { Link } from 'react-router-dom';
import fitforge from '../assets/images/fitTRACK@2x.png';

const MainPage = () => {
    return (
        <div className="container">
            <img src={fitforge} className="img_main"/>
            <div>
                <Link to="/login" className=" m-4 btn-lg btn btn-dark">Login</Link>
                <Link to="/register" className=" m-4 btn-lg btn btn-dark">Registrar</Link>
            </div>
        </div>
    );
};

export default MainPage;
