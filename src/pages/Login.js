import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Login.css';
import BackButton from './components/BackButton';
import { AuthContext } from './context/AuthContext';
import ft from '../assets/images/FTBW@2x.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/home');
        } catch (error) {
            console.error('Erro ao fazer login', error);
        }
    };

    return (
        <div className="container">
            <BackButton />
            <div className="div_login">
                <h2 className="mb-3">Login</h2>
                <img src={ft} className="img_login" />
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-light">Login</button>
                </form>
            </div>
            
        </div>
    );
};

export default LoginPage;
