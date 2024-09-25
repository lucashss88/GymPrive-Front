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

            const response = await fetch('https://gymprive-back-production.up.railway.app/workouts', {
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
            const workoutId = createdWorkout.id; // Supondo que a resposta contenha o ID do treino criado

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

            {/*{exercises && exercises.length > 0 ? (*/}
            {/*    <ul>*/}
            {/*        {exercises.map((item, index) => (*/}
            {/*            <p key={index}>*/}
            {/*                <span>{item.name} - {item.reps} reps</span>*/}
            {/*                <button className="m-2 btn bg-danger text-white" onClick={() => removeExercise(index)}>Remover</button>*/}
            {/*            </p>*/}
            {/*        ))}*/}
            {/*    </ul>*/}
            {/*) : (*/}
            {/*    <p>Nenhum exercício adicionado ainda.</p>*/}
            {/*)}*/}

            {/*<button className="button btn bg-dark text-white" onClick={() => navigate('/add-exercise')}>Adicionar Exercício</button>*/}
            
            <button className="button btn bg-dark text-white" onClick={handleCreateWorkout}>Criar Treino</button>
        </div>
    );
};

export default CreateWorkout;
