import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    Spinner,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function FormDetailPage() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await api.get(`/api/forms/${id}`);
                setForm(res.data);
            } catch (error) {
                console.error('Error fetching form:', error);
                toast({
                    title: 'Error fetching form.',
                    description: 'Unable to load form data.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/dashboard');
            }
        };

        fetchForm();
    }, [id, navigate, toast]);

    if (!form) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={5}>
            <Heading mb={4}>{form.Template.title}</Heading>
            <VStack spacing={4} align="stretch">
                {form.FormAnswers.map(answer => (
                    <Box
                        key={answer.id}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                    >
                        <Text fontWeight="bold">{answer.Question.text}</Text>
                        <Text>{answer.answer}</Text>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}

export default FormDetailPage;
