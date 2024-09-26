import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import BackButton from "./components/BackButton";
import '../assets/Workout.css';
import { useNavigate, useParams } from 'react-router-dom';

const AddExerciseScreen = ({ navigation }) => {
    const { workoutId } = useParams();
    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [sets, setSets] = useState('');
    const [description, setDescription] = useState('');
    const { addExercise } = useContext(AuthContext);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleAddExercise = async () => {
        const newExercise = { name, reps, weight, sets, description };
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/workouts/${workoutId}/exercises`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(newExercise)
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.msg || 'Erro ao adicionar exercício.');
            }
            
            addExercise(newExercise);
            navigate(-1);
        } catch (error) {
            console.error('Erro ao adicionar exercício:', error);
        }
    };

    return (
        <div className="container">
            <BackButton />
            <h2 className="title">Adicionar Exercício</h2>
            <input
                className="input"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="input"
                placeholder="Repetições"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
            />
            <input
                className="input"
                placeholder="Carga"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
            />
            <input
                className="input"
                placeholder="Sets"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
            />
            <input
                className="input"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button className="button btn btn-dark" onClick={handleAddExercise}>
                <span>Adicionar Exercício</span>
            </button>
        </div>
    );
};

export default AddExerciseScreen;
