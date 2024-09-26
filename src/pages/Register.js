import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Login.css';
import BackButton from './components/BackButton';
import { AuthContext } from './context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, weight, height, age);
            navigate('/login');
        } catch (error) {
            console.error('Erro ao registrar usuário', error);
        }
    };


    return (
        <div className="container">
            <BackButton />
            <div className="div_login">
                <h2 className="mb-3">Registro</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group mb-3">
                        <label>Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="form-group mb-3">
                        <label>Peso (opcional)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Altura (opcional)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Idade (opcional)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-light">Registrar</button>
                </form>
            </div>
            
        </div>
    );
};

export default RegisterPage;
