import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/Workout.css';
import BackButton from "./components/BackButton";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ListWorkout = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://gymprive-back-production.up.railway.app/workouts', {
                    headers: { 'x-auth-token': token }
                });
                setWorkouts(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    const handleViewExercises = async (workoutId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://gymprive-back-production.up.railway.app/workouts/${workoutId}/exercises`, {
                headers: { 'x-auth-token': token }
            });

            if (response.status === 204) {
                setExercises([]); 
            } else {
                setExercises(response.data);
            }
            
            const selectedWorkout = workouts.find(workout => workout.id === workoutId);
            setSelectedWorkout(selectedWorkout);
            
            setShowModal(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteWorkout = async (workoutId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`https://gymprive-back-production.up.railway.app/workouts/${workoutId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.msg || 'Erro ao deletar treino.');
            }
            
            setWorkouts(workouts.filter(workout => workout.id !== workoutId));
            toast.success('Treino deletado com sucesso!')
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.text(`Exercícios do Treino: ${selectedWorkout?.name}`, 14, 16);
        doc.autoTable({
            head: [['Nome', 'Repetições', 'Carga', 'Sets', 'Descrição']],
            body: exercises.map(exercise => [
                exercise.name,
                exercise.reps,
                exercise.weight,
                exercise.sets,
                exercise.description,
            ]),
            startY: 26,
        });

        doc.save(`treino_${selectedWorkout?.name}.pdf`);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setExercises([]);
        setSelectedWorkout(null);
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {error}</p>;

    return (
        <div className="container">
            <BackButton />
            <h2>Lista de Treinos</h2>
            {error && <p className="error">{error}</p>}
            <table className="table">
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Data Início</th>
                    <th>Data Fim</th>
                    <th>Semana</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {workouts.map((workout) => (
                    <tr key={workout.id}>
                        <td>{workout.name}</td>
                        <td>{workout.startDate}</td>
                        <td>{workout.endDate}</td>
                        <td>{workout.week}</td>
                        <td>
                            <button className="btn bg-dark text-white" onClick={() => handleViewExercises(workout.id)}>Ver Exercícios</button>
                            <button className="btn bg-success text-white m-2" onClick={() => navigate(`/add-exercise/${workout.id}`)}>Adicionar Exercício</button>
                            <button className="btn bg-danger text-white" onClick={() => handleDeleteWorkout(workout.id)}>Deletar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Exercícios do Treino: {selectedWorkout?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {exercises.length > 0 ? (
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Repetições</th>
                                <th>Carga</th>
                                <th>Sets</th>
                                <th>Descrição</th>
                            </tr>
                            </thead>
                            <tbody>
                            {exercises.map((exercise) => (
                                <tr key={exercise.id}>
                                    <td>{exercise.name}</td>
                                    <td>{exercise.reps}</td>
                                    <td>{exercise.weight}</td>
                                    <td>{exercise.sets}</td>
                                    <td>{exercise.description}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhum exercício encontrado para este treino.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fechar
                    </Button>
                    <button className="btn bg-primary text-white" onClick={handleDownloadPDF}>
                        Download em PDF
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListWorkout;