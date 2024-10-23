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
    FormErrorMessage,
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
                <VStack spacing={4} mt={4}>
                    <FormControl isInvalid={errors.title}>
                        <FormLabel>Title</FormLabel>
                        <Input
                            name="title"
                            value={templateData.title}
                            onChange={handleChange}
                            placeholder="Enter the template title"
                        />
                        <FormErrorMessage>{errors.title}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.description}>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            name="description"
                            value={templateData.description}
                            onChange={handleChange}
                            placeholder="Enter the template description"
                        />
                        <FormErrorMessage>
                            {errors.description}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.topic}>
                        <FormLabel>Topic</FormLabel>
                        <Input
                            name="topic"
                            value={templateData.topic}
                            onChange={handleChange}
                            placeholder="Enter the template topic"
                        />
                        <FormErrorMessage>{errors.topic}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Make this template public</FormLabel>
                        <Switch
                            name="isPublic"
                            isChecked={templateData.isPublic}
                            onChange={e =>
                                setTemplateData({
                                    ...templateData,
                                    isPublic: e.target.checked,
                                })
                            }
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="teal" width="full">
                        Save Template
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}

export default CreateTemplatePage;
