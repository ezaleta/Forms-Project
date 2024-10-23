import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import FillTemplatePage from './pages/FillTemplatePage';
import TemplatePage from './pages/TemplatePage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/templates/create"
                    element={
                        <PrivateRoute>
                            <CreateTemplatePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/templates/:id/fill"
                    element={
                        <PrivateRoute>
                            <FillTemplatePage />
                        </PrivateRoute>
                    }
                />
                <Route path="/templates/:id" element={<TemplatePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </>
    );
}

export default App;
