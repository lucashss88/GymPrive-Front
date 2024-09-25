import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [nameUser, setNameUser] = useState('');
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    axios.defaults.headers.common['x-auth-token'] = token;
                    const response = await axios.get('https://gymprive-back-production.up.railway.app/auth/me');
                    setUser(response.data.user);
                    setNameUser(response.data.user.name);
                } else {
                    console.log('Token não encontrado');
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const register = async (name, email, password, weight, height, age) => {
        try {
            const response = await axios.post('https://gymprive-back-production.up.railway.app/auth/register', {
                name,
                email,
                password,
                weight,
                height,
                age
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['x-auth-token'] = token;
            setUser(user);
            setNameUser(user.name);
            toast.success('Usuário registrado com sucesso.');
        } catch (error) {
            console.error('Erro ao registrar usuário', error.response ? error.response.data : error);
            toast.error('Falha ao registrar usuário.');
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('https://gymprive-back-production.up.railway.app/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['x-auth-token'] = token;
            setUser(user);
            toast.success('Login realizado com sucesso.');
            console.log('Token: '+ token);
        } catch (error) {
            console.error('Erro ao fazer login', error.response ? error.response.data : error);
            toast.error('Falha ao fazer login.');
            throw error;
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem('token');
            axios.defaults.headers.common['x-auth-token'] = null;
            setUser(null);
            toast.success('Logout realizado com sucesso.');
        } catch (error) {
            console.error('Erro ao fazer logout', error);
            throw error;
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['x-auth-token'] = token;
                const response = await axios.put('https://gymprive-back-production.up.railway.app/auth/me', updatedData);
                setUser(response.data.user);
                setNameUser(response.data.user.name);
                toast.success('Perfil atualizado com sucesso.');
            } else {
                toast.error('Usuário não autenticado.');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil', error.response ? error.response.data : error);
            toast.error('Falha ao atualizar perfil.');
            throw error;
        }
    };

    const resetPassword = async (email) => {
        try {
            await axios.post('https://gymprive-back-production.up.railway.app/auth/reset-password', { email });
            toast.success('Instruções de redefinição de senha enviadas.');
        } catch (error) {
            console.error('Erro ao solicitar redefinição de senha', error.response ? error.response.data : error);
            toast.error('Falha ao solicitar redefinição de senha.');
            throw error;
        }
    };

    const addExercise = (exercise) => {
        setExercises([...exercises, exercise]);
        toast.success('Exercício adicionado com sucesso.');
    };

    const removeExercise = (index) => {
        const updatedExercises = exercises.filter((_, i) => i !== index);
        setExercises(updatedExercises);
        toast.success('Exercício removido com sucesso.');
    };

    const removeAllExercises = () => {
        setExercises([]);
        toast.success('Todos os exercícios foram removidos.');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile, resetPassword, addExercise, removeAllExercises, removeExercise, exercises }}>
            {children}
        </AuthContext.Provider>
    );
};
