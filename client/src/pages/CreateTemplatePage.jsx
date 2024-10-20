import React, { useState } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Switch,
    Select,
    Button,
    VStack,
    HStack,
    Tag,
    TagLabel,
    TagCloseButton,
} from '@chakra-ui/react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function CreateTemplatePage() {
    const [templateData, setTemplateData] = useState({
        title: '',
        description: '',
        topic: '',
        isPublic: true,
        tags: [],
        questions: [],
    });
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setTemplateData({ ...templateData, [e.target.name]: e.target.value });
    };

    const handleTagAdd = () => {
        if (tagInput && !templateData.tags.includes(tagInput)) {
            setTemplateData({
                ...templateData,
                tags: [...templateData.tags, tagInput],
            });
            setTagInput('');
        }
    };

    const handleTagRemove = tag => {
        setTemplateData({
            ...templateData,
            tags: templateData.tags.filter(t => t !== tag),
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            const res = await api.post('/api/templates', templateData);
            navigate(`/templates/${res.data.id}`);
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!templateData.title) newErrors.title = 'Title is required';
        if (!templateData.description)
            newErrors.description = 'Description is required';
        return newErrors;
    };

    return (
        <Box p={5}>
            <Heading>Create Template</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl isInvalid={errors.title}>
                    <FormLabel>Title</FormLabel>
                    <Input
                        name="title"
                        value={templateData.title}
                        onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>
                <Button mt={4} colorScheme="teal" type="submit">
                    Save Template
                </Button>
            </form>
        </Box>
    );
}

export default CreateTemplatePage;
