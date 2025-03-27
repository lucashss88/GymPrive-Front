import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { toast } from 'react-toastify';
import BackButton from "./components/BackButton";
import { useNavigate } from 'react-router-dom';
import ft from '../assets/images/FTnew@2x.png';

const EditProfile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        weight: '',
        height: '',
        age: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                weight: user.weight || '',
                height: user.height || '',
                age: user.age || ''
            });
        }
    }, [user]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            toast.success('Perfil atualizado com sucesso!');
            navigate('/home');
        } catch (error) {
            toast.error('Erro ao atualizar o perfil.');
        }
    };

    return (
        <div className="container">
            <BackButton />
            <img src={ft} className="img_login" />
            <h2>Editar Perfil</h2>
            <form onSubmit={onSubmit}>
                <table>
                    <tbody>
                    <tr>
                        <td>Nome:</td>
                        <td>
                            <input
                                className="input"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Email:</td>
                        <td>
                            <input
                                className="input"
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Peso:</td>
                        <td>
                            <input
                                className="input"
                                type="text"
                                name="weight"
                                value={formData.weight}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Altura:</td>
                        <td>
                            <input
                                className="input"
                                type="number"
                                name="height"
                                step="0.01"
                                value={formData.height}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Idade:</td>
                        <td>
                            <input
                                className="input"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button type="submit" className="button btn btn-dark">Salvar</button>
            </form>
        </div>
    );
};

export default EditProfile;
