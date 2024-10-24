import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Button,
    Spinner,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function FillTemplatePage() {
    const { id } = useParams();
    const [template, setTemplate] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await api.get(`/api/templates/${id}`);
                setTemplate(res.data);
            } catch (error) {
                console.error('Error fetching template:', error);
                setError('Failed to load template');
                toast({
                    title: 'Error fetching template.',
                    description: 'Unable to load template data.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [id, navigate, toast]);

    const handleInputChange = (questionId, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: value,
        }));
    };

    const handleSubmit = async () => {
        const missingRequiredQuestions = template.Questions.filter(
            q => q.isRequired && !answers[q.id]
        );

        if (missingRequiredQuestions.length > 0) {
            toast({
                title: 'Please complete all required fields.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            const answersArray = Object.keys(answers).map(questionId => ({
                questionId: parseInt(questionId),
                answer: answers[questionId],
            }));

            await api.post('/api/forms', {
                templateId: template.id,
                answers: answersArray,
            });

            toast({
                title: 'Form submitted successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: 'Error submitting form.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (!template) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={5}>
            <Heading mb={4}>{template.title}</Heading>
            <VStack spacing={4} align="stretch">
                {template.Questions.map(question => (
                    <FormControl
                        key={question.id}
                        isRequired={question.isRequired}
                    >
                        <FormLabel>{question.text}</FormLabel>
                        {question.type === 'text' && (
                            <Input
                                value={answers[question.id] || ''}
                                onChange={e =>
                                    handleInputChange(
                                        question.id,
                                        e.target.value
                                    )
                                }
                            />
                        )}
                        {question.type === 'textarea' && (
                            <Textarea
                                value={answers[question.id] || ''}
                                onChange={e =>
                                    handleInputChange(
                                        question.id,
                                        e.target.value
                                    )
                                }
                            />
                        )}
                        {question.type === 'select' && (
                            <Select
                                placeholder="Select option"
                                value={answers[question.id] || ''}
                                onChange={e =>
                                    handleInputChange(
                                        question.id,
                                        e.target.value
                                    )
                                }
                            >
                                {question.options
                                    .split(';')
                                    .map((option, idx) => (
                                        <option key={idx} value={option.trim()}>
                                            {option.trim()}
                                        </option>
                                    ))}
                            </Select>
                        )}
                    </FormControl>
                ))}
                <Button onClick={handleSubmit} colorScheme="blue" mt={6}>
                    Submit
                </Button>
            </VStack>
        </Box>
    );
}

export default FillTemplatePage;
