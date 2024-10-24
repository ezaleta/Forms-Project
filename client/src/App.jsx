import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import FillTemplatePage from './pages/FillTemplatePage';
import TemplatePage from './pages/TemplatePage';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import ProfilePage from './pages/ProfilePage';
import EditTemplatePage from './pages/EditTemplatePage';
import FormDetailPage from './pages/FormDetailPage';
import AdminTemplatesPage from './pages/AdminTemplatesPage';
import AdminUsersPage from './pages/AdminUsersPage';

function App() {
    return (
        <Box display="flex" minH="100vh">
            <Sidebar />
            <Box flex="1" ml={{ base: 0, md: '250px' }} p={4}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
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
                    <Route
                        path="/templates/edit/:id"
                        element={<EditTemplatePage />}
                    />
                    <Route path="/templates/:id" element={<TemplatePage />} />
                    <Route path="/forms/:id" element={<FormDetailPage />} />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <ProfilePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <PrivateRoute adminRequired={true}>
                                <AdminUsersPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/templates"
                        element={
                            <PrivateRoute adminRequired={true}>
                                <AdminTemplatesPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Box>
        </Box>
    );
}

export default App;
