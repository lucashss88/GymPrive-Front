import React from 'react';
import { Link } from 'react-router-dom';
import fitforge from '../assets/images/fitTRACK@2x.png';
import fittrack from '../assets/images/ftMartelo@3x.png';

const MainPage = () => {
    return (
        <div className="container">
            <img src={fittrack} className="img_main"/>
            <div>
                <Link to="/login" className=" m-4 btn-lg btn btn-dark">Login</Link>
                <Link to="/register" className=" m-4 btn-lg btn btn-dark">Registrar</Link>
            </div>
        </div>
    );
};

export default MainPage;
