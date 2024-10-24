import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    VStack,
    Select,
    Switch,
    useToast,
    IconButton,
    Flex,
    Spacer,
    Text,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import api from '../services/api';

function EditTemplatePage() {
    const { id } = useParams();
    const [template, setTemplate] = useState({
        title: '',
        description: '',
    });
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        type: 'text',
        isRequired: false,
        options: '',
    });
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await api.get(`/api/templates/${id}`);
                setTemplate({
                    title: res.data.title,
                    description: res.data.description,
                });
                setQuestions(res.data.Questions || []);
            } catch (error) {
                console.error('Error fetching template:', error);
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

    const handleTemplateChange = e => {
        const { name, value } = e.target;
        setTemplate(prevTemplate => ({
            ...prevTemplate,
            [name]: value,
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleDeleteQuestion = index => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, newQuestion]);
        setNewQuestion({
            text: '',
            type: 'text',
            isRequired: false,
            options: '',
        });
    };

    const handleNewQuestionChange = (field, value) => {
        setNewQuestion(prevQuestion => ({
            ...prevQuestion,
            [field]: value,
        }));
    };

    const handleUpdateTemplate = async () => {
        try {
            await api.put(`/api/templates/${id}`, {
                title: template.title,
                description: template.description,
                questions,
            });
            toast({
                title: 'Template updated.',
                description: 'Your template has been updated successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate(`/templates/${id}`);
        } catch (error) {
            console.error('Error updating template:', error);
            toast({
                title: 'Error.',
                description: 'Failed to update template.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                Loading...
            </Box>
        );
    }

    return (
        <Box p={5}>
            <Heading mb={4}>Edit Template</Heading>
            <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                        name="title"
                        value={template.title}
                        onChange={handleTemplateChange}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        name="description"
                        value={template.description}
                        onChange={handleTemplateChange}
                    />
                </FormControl>

                <Heading size="md" mt={6} mb={2}>
                    Questions
                </Heading>

                {questions.map((question, index) => (
                    <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                        <Flex alignItems="center">
                            <Heading size="sm" flex="1">
                                Question {index + 1}
                            </Heading>
                            <IconButton
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteQuestion(index)}
                            />
                        </Flex>
                        <FormControl isRequired mt={2}>
                            <FormLabel>Question Text</FormLabel>
                            <Input
                                value={question.text}
                                onChange={e =>
                                    handleQuestionChange(
                                        index,
                                        'text',
                                        e.target.value
                                    )
                                }
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Question Type</FormLabel>
                            <Select
                                value={question.type}
                                onChange={e =>
                                    handleQuestionChange(
                                        index,
                                        'type',
                                        e.target.value
                                    )
                                }
                            >
                                <option value="text">Text</option>
                                <option value="textarea">Textarea</option>
                                <option value="select">Select</option>
                            </Select>
                        </FormControl>
                        {question.type === 'select' && (
                            <FormControl isRequired>
                                <FormLabel>
                                    Options (separated by semicolons)
                                </FormLabel>
                                <Input
                                    value={question.options}
                                    onChange={e =>
                                        handleQuestionChange(
                                            index,
                                            'options',
                                            e.target.value
                                        )
                                    }
                                />
                            </FormControl>
                        )}
                        <FormControl display="flex" alignItems="center" mt={2}>
                            <FormLabel mb="0">Is Required?</FormLabel>
                            <Switch
                                isChecked={question.isRequired}
                                onChange={e =>
                                    handleQuestionChange(
                                        index,
                                        'isRequired',
                                        e.target.checked
                                    )
                                }
                            />
                        </FormControl>
                    </Box>
                ))}

                <Heading size="sm" mt={4}>
                    Add New Question
                </Heading>
                <FormControl isRequired>
                    <FormLabel>Question Text</FormLabel>
                    <Input
                        value={newQuestion.text}
                        onChange={e =>
                            handleNewQuestionChange('text', e.target.value)
                        }
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                        value={newQuestion.type}
                        onChange={e =>
                            handleNewQuestionChange('type', e.target.value)
                        }
                    >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Select</option>
                    </Select>
                </FormControl>
                {newQuestion.type === 'select' && (
                    <FormControl isRequired>
                        <FormLabel>Options (separated by semicolons)</FormLabel>
                        <Input
                            value={newQuestion.options}
                            onChange={e =>
                                handleNewQuestionChange(
                                    'options',
                                    e.target.value
                                )
                            }
                        />
                    </FormControl>
                )}
                <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Is Required?</FormLabel>
                    <Switch
                        isChecked={newQuestion.isRequired}
                        onChange={e =>
                            handleNewQuestionChange(
                                'isRequired',
                                e.target.checked
                            )
                        }
                    />
                </FormControl>
                <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddQuestion}
                    colorScheme="teal"
                    variant="outline"
                >
                    Add Question
                </Button>

                <Button
                    onClick={handleUpdateTemplate}
                    colorScheme="blue"
                    mt={6}
                >
                    Update Template
                </Button>
            </VStack>
        </Box>
    );
}

export default EditTemplatePage;
