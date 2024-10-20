import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Checkbox,
    Button,
    VStack,
} from '@chakra-ui/react';

function FillTemplatePage() {
    const { id } = useParams();
    const [template, setTemplate] = useState(null);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await api.get(`/api/templates/${id}`);
                setTemplate(res.data);
            } catch (err) {
                setError('Failed to load template');
            }
        };
        fetchTemplate();
    }, [id]);

    const handleChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/forms/${id}`, {
                answers: Object.entries(answers).map(([questionId, value]) => ({
                    questionId,
                    value,
                })),
            });
        } catch (err) {
            setError('Failed to submit form');
        }
    };

    if (!template) return <div>Loading...</div>;

    return (
        <Box p={5}>
            <Heading>{template.title}</Heading>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    {template.Questions.map(question => (
                        <FormControl key={question.id} isRequired>
                            <FormLabel>{question.title}</FormLabel>
                            {question.type === 'single-line' && (
                                <Input
                                    value={answers[question.id] || ''}
                                    onChange={e =>
                                        handleChange(
                                            question.id,
                                            e.target.value
                                        )
                                    }
                                />
                            )}
                        </FormControl>
                    ))}
                    <Button type="submit" colorScheme="teal">
                        Submit
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}

export default FillTemplatePage;
