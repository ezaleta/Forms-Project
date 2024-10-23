import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
} from '@chakra-ui/react';
import api from '../services/api';

function ProfilePage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const toast = useToast();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await api.get('/api/users/me');
                setFormData(res.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await api.put('/api/users/me', formData);
            toast({
                title: 'Profile updated.',
                description: 'Your profile has been updated successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error.',
                description: 'Failed to update profile.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await api.delete('/api/users/me');
            localStorage.removeItem('token');
            window.location.href = '/register';
        } catch (error) {
            console.error('Error deleting account:', error);
            toast({
                title: 'Error.',
                description: 'Failed to delete account.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={5}>
            <Heading mb={4}>My Profile</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired mb={4}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl isRequired mb={4}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl isRequired mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </FormControl>
                <Button type="submit" colorScheme="teal" mr={4}>
                    Save Changes
                </Button>
                <Button colorScheme="red" onClick={handleDeleteAccount}>
                    Delete Account
                </Button>
            </form>
        </Box>
    );
}

export default ProfilePage;
