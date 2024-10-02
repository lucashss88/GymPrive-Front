import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/Workout.css';
import BackButton from "./components/BackButton";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'react-toastify/dist/ReactToastify.css';

const ListWorkout = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', week: '' });
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/workouts`, {
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
            const response = await axios.get(`${API_URL}/workouts/${workoutId}/exercises`, {
                headers: { 'x-auth-token': token }
            });

            setExercises(response.data.length > 0 ? response.data : []);
            const selectedWorkout = workouts.find(workout => workout.id === workoutId);
            setSelectedWorkout(selectedWorkout);
            
            setShowModal(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditWorkout = (workout) => {
        setSelectedWorkout(workout);
        setFormData({
            name: workout.name,
            startDate: workout.startDate,
            endDate: workout.endDate,
            week: workout.week
        });
        setShowEditModal(true);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveWorkout = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(
                `${API_URL}/workouts/${selectedWorkout.id}`,
                formData,
                {
                    headers: { 'x-auth-token': token }
                }
            );
            const updatedWorkout = response.data;

            setWorkouts((prevWorkouts) =>
                prevWorkouts.map((workout) =>
                    workout.id === updatedWorkout.id ? updatedWorkout : workout
                )
            );

            toast.success('Treino atualizado com sucesso!');
            setShowEditModal(false);
        } catch (error) {
            toast.error('Erro ao atualizar o treino.');
            console.error('Erro ao atualizar treino:', error);
        }
    };

    const handleDeleteWorkout = async (workoutId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_URL}/workouts/${workoutId}`, {
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

    const handleDeleteExercise = async (workoutId, exerciseId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/workouts/${workoutId}/exercises/${exerciseId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.msg || 'Erro ao excluir exercício.');
            }

            setExercises((prevExercises) => prevExercises.filter(exercise => exercise.id !== exerciseId));
            toast.success('Exercício deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir exercício:', error);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.text(`Exercícios do Treino: ${selectedWorkout?.name}`, 14, 16);
        doc.autoTable({
            head: [['Nome', 'Carga', 'Descrição']],
            body: exercises.map(exercise => [
                exercise.name,
                exercise.weight,
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
                        <td>{new Date(workout.startDate).toLocaleDateString('pt-BR')}</td>
                        <td>{new Date(workout.endDate).toLocaleDateString('pt-BR')}</td>
                        <td>{workout.week}</td>
                        <td>
                            <button className="btn btn-dark m-1" onClick={() => handleViewExercises(workout.id)}>Ver Exercícios</button>
                            <button className="btn btn-dark m-1" onClick={() => navigate(`/add-exercise/${workout.id}`)}>Adicionar Exercício</button>
                            <button className="btn btn-dark m-1" onClick={() => handleEditWorkout(workout)}>Editar</button>
                            <button className="btn bg-danger m-1" onClick={() => handleDeleteWorkout(workout.id)}>Deletar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            
            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Exercícios do Treino: {selectedWorkout?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {exercises.length > 0 ? (
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Carga</th>
                                <th>Descrição</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {exercises.map((exercise) => (
                                <tr key={exercise.id}>
                                    <td>{exercise.name}</td>
                                    <td>{exercise.weight}</td>
                                    <td>{exercise.description}</td>
                                    <td>
                                        <button className="btn bg-danger" onClick={() => handleDeleteExercise(selectedWorkout.id, exercise.id)}>
                                            Excluir
                                        </button>
                                    </td>
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
                    <button className="btn btn-dark" onClick={handleDownloadPDF}>
                        Download em PDF
                    </button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Treino</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="startDate">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="startDate">Data Início</label>
                            <input
                                type="date"
                                className="form-control"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDate">Data Fim</label>
                            <input
                                type="date"
                                className="form-control"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="week">Semana</label>
                            <input
                                type="text"
                                className="form-control"
                                id="week"
                                name="week"
                                value={formData.week}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" className="btn btn-dark" onClick={handleSaveWorkout}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListWorkout;