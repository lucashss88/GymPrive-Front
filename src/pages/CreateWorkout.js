import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import axios from "axios";
import BackButton from "./components/BackButton";
import { useNavigate } from 'react-router-dom';
import '../assets/Workout.css';

const CreateWorkout = ({ navigation }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [week, setWeek] = useState('Semana 1');
    const [workoutName, setWorkoutName] = useState('');
    const { removeAllExercises } = useContext(AuthContext);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleCreateWorkout = async () => {
        try {
            const token = localStorage.getItem('token');

            const newWorkout = {
                name: workoutName,
                startDate,
                endDate,
                week,
                exercises: [],
            };

            const response = await fetch(`${API_URL}/workouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(newWorkout)
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.msg || 'Erro ao criar treino.');
            }

            const createdWorkout = await response.json();
            const workoutId = createdWorkout.id;

            console.log('Treino criado com sucesso:', createdWorkout);
            setStartDate('');
            setEndDate('');
            setWeek('');
            removeAllExercises();

            navigate('/list-workout');
        } catch (error) {
            console.error('Erro ao criar treino:', error);
        }
    };

    return (
        <div className="container">
            <BackButton />
            <h2>Criar Treino</h2>
            <input
                className="input"
                placeholder="Nome do Treino"
                value={workoutName} 
                onChange={(e) => setWorkoutName(e.target.value)} 
            />
            <input
                className="input"
                type="date"
                placeholder="Data de Início"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <input
                className="input"
                type="date"
                placeholder="Data Final"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <select className="input" value={week} onChange={(e) => setWeek(e.target.value)}>
                <option value="Semana 1">Semana 1</option>
                <option value="Semana 2">Semana 2</option>
                <option value="Semana 3">Semana 3</option>
                <option value="Semana 4">Semana 4</option>
            </select>
            <button className="button btn btn-dark " onClick={handleCreateWorkout}>Criar Treino</button>
        </div>
    );
};

export default CreateWorkout;
