import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Button,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Stack,
    Link,
    useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';

function DashboardPage() {
    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    const [templatesError, setTemplatesError] = useState(null);
    const [forms, setForms] = useState([]);
    const [loadingForms, setLoadingForms] = useState(true);
    const [formsError, setFormsError] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await api.get('/api/templates/myTemplates');
                setTemplates(res.data);
            } catch (error) {
                console.error('Error fetching templates:', error);
                setTemplatesError('Failed to load templates');
            } finally {
                setLoadingTemplates(false);
            }
        };

        const fetchForms = async () => {
            try {
                const res = await api.get('/api/forms/myForms');
                setForms(res.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
                setFormsError('Failed to load forms');
            } finally {
                setLoadingForms(false);
            }
        };

        fetchTemplates();
        fetchForms();
    }, []);

    const deleteTemplate = async templateId => {
        try {
            await api.delete(`/api/templates/${templateId}`);
            // Update the state to remove the deleted template
            setTemplates(
                templates.filter(template => template.id !== templateId)
            );
            toast({
                title: 'Template deleted.',
                description: 'Your template has been deleted successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting template:', error);
            toast({
                title: 'Error deleting template.',
                description: 'An error occurred while deleting the template.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (loadingTemplates || loadingForms) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    if (templatesError || formsError) {
        return (
            <Alert status="error">
                <AlertIcon />
                {templatesError || formsError}
            </Alert>
        );
    }

    return (
        <Box p={5}>
            <Heading mb={4}>Dashboard</Heading>
            {templates.length > 0 ? (
                <>
                    <Heading size="md" mb={4}>
                        My Templates
                    </Heading>
                    <Stack spacing={4}>
                        {templates.map(template => (
                            <Box
                                key={template.id}
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                _hover={{ boxShadow: 'md' }}
                            >
                                <Heading size="sm">
                                    <Link
                                        as={RouterLink}
                                        to={`/templates/${template.id}`}
                                    >
                                        {template.title}
                                    </Link>
                                </Heading>
                                <Text mt={2}>{template.description}</Text>
                                <Button
                                    as={RouterLink}
                                    to={`/templates/edit/${template.id}`}
                                    size="sm"
                                    mt={4}
                                    colorScheme="teal"
                                    mr={2}
                                >
                                    Edit Template
                                </Button>
                                <Button
                                    size="sm"
                                    mt={4}
                                    colorScheme="red"
                                    onClick={() => deleteTemplate(template.id)}
                                >
                                    Delete Template
                                </Button>
                            </Box>
                        ))}
                    </Stack>
                </>
            ) : (
                <Text>
                    You have no templates.{' '}
                    <Link
                        as={RouterLink}
                        to="/templates/create"
                        color="teal.500"
                    >
                        Create one now
                    </Link>
                    .
                </Text>
            )}
        </Box>
    );
}

export default DashboardPage;
