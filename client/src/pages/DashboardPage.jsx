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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

function DashboardPage() {
    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    const [templatesError, setTemplatesError] = useState(null);
    const [forms, setForms] = useState([]);
    const [loadingForms, setLoadingForms] = useState(true);
    const [formsError, setFormsError] = useState(null);

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
                                >
                                    Edit Template
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
