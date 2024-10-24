import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import api from '../services/api';

function CreateTemplatePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        type: 'text',
        isRequired: false,
        options: '',
    });
    const toast = useToast();

    const handleAddQuestion = () => {
        setQuestions([...questions, newQuestion]);
        setNewQuestion({
            text: '',
            type: 'text',
            isRequired: false,
            options: '',
        });
    };

    const handleCreateTemplate = async () => {
        try {
            const res = await api.post('/api/templates', {
                title,
                description,
                questions,
            });
            toast({
                title: 'Template created.',
                description: 'Your template has been created successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error creating template:', error);
            toast({
                title: 'Error.',
                description: 'Failed to create template.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={5}>
            <Heading mb={4}>Create Template</Heading>
            <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </FormControl>

                <Heading size="md" mt={6} mb={2}>
                    Questions
                </Heading>

                {questions.map((q, index) => (
                    <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                        <Heading size="sm">{q.text}</Heading>
                        <Text>Type: {q.type}</Text>
                        {q.type === 'select' && (
                            <Text>Options: {q.options}</Text>
                        )}
                        <Text>Required: {q.isRequired ? 'Yes' : 'No'}</Text>
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
                            setNewQuestion({
                                ...newQuestion,
                                text: e.target.value,
                            })
                        }
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                        value={newQuestion.type}
                        onChange={e =>
                            setNewQuestion({
                                ...newQuestion,
                                type: e.target.value,
                            })
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
                                setNewQuestion({
                                    ...newQuestion,
                                    options: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                )}
                <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Is Required?</FormLabel>
                    <Switch
                        isChecked={newQuestion.isRequired}
                        onChange={e =>
                            setNewQuestion({
                                ...newQuestion,
                                isRequired: e.target.checked,
                            })
                        }
                    />
                </FormControl>
                <Button onClick={handleAddQuestion} colorScheme="teal">
                    Add Question
                </Button>

                <Button
                    onClick={handleCreateTemplate}
                    colorScheme="blue"
                    mt={6}
                >
                    Create Template
                </Button>
            </VStack>
        </Box>
    );
}

export default CreateTemplatePage;
