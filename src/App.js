import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './pages/context/AuthContext';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import RegisterPage from './pages/Register';
import MainPage from './pages/MainPage';
import AddExercise from './pages/AddExercise';
import CreateWorkout from './pages/CreateWorkout';
import ListWorkout from './pages/ListWorkout';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/add-exercise/:workoutId" element={<AddExercise />} />
                    <Route path="/create-workout" element={<CreateWorkout />} />
                    <Route path="/list-workout" element={<ListWorkout />} />
                </Routes>
            </Router>
            <ToastContainer />
        </AuthProvider>
    );
}

export default App;
