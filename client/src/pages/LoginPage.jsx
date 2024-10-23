import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Heading,
    VStack,
    Text,
} from '@chakra-ui/react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                formData
            );
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    return (
        <Box p={5}>
            <Heading>Login</Heading>
            {error && <Text color="red.500">{error}</Text>}
            <form onSubmit={handleSubmit}>
                <VStack spacing={4} mt={4}>
                    <FormControl isRequired>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="blue" width="full">
                        Login
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}

export default LoginPage;
