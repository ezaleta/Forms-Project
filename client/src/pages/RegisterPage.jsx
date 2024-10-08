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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
                formData
            );
            localStorage.setItem('token', res.data.token);
            navigate('/login');
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    return (
        <Box p={5}>
            <Heading>Register</Heading>
            {error && <Text color="red.500">{error}</Text>}
            <form onSubmit={handleSubmit}>
                <VStack spacing={4} mt={4}>
                    <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                        />
                    </FormControl>
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
                    <Button type="submit" colorScheme="teal" width="full">
                        Register
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}

export default RegisterPage;
