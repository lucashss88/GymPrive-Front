import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { FaArrowLeft } from 'react-icons/fa';

const Backbutton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <p onClick={handleBack} className='voltar'><FaArrowLeft /></p>
        </>
    );
};

export default Backbutton;