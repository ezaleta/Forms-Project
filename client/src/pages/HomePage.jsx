import React, { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    Grid,
    GridItem,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Button,
    Image,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function HomePage() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicTemplates = async () => {
            try {
                const res = await api.get('/api/templates/public');
                setTemplates(res.data);
            } catch (error) {
                console.error('Error fetching public templates:', error);
                setError('Failed to load templates');
            } finally {
                setLoading(false);
            }
        };

        fetchPublicTemplates();
    }, []);

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error" mt={4}>
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Box p={5}>
            <Heading>Welcome!</Heading>
            <Text mt={4}>
                Create and share custom forms, quizzes, and questionnaires with
                ease.
            </Text>
            <Heading mb={6}>Public Templates</Heading>
            {templates.length > 0 ? (
                <Grid
                    templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                    gap={6}
                >
                    {templates.map(template => (
                        <GridItem
                            key={template.id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            _hover={{ boxShadow: 'md' }}
                        >
                            <Image
                                src={
                                    template.imageUrl ||
                                    'https://img.icons8.com/ios/50/no-image.png'
                                }
                                alt={template.title}
                                objectFit="contain"
                                w="100%"
                                h="50%"
                                mb={4}
                            />
                            <Heading size="md">
                                <Link to={`/templates/${template.id}`}>
                                    {template.title}
                                </Link>
                            </Heading>
                            <Text mt={2}>{template.description}</Text>
                            <Text mt={2} fontSize="sm" color="gray.500">
                                By {template.author.firstName}{' '}
                                {template.author.lastName}
                            </Text>
                            <Button
                                as={Link}
                                to={`/templates/${template.id}/fill`}
                                mt={4}
                                colorScheme="teal"
                                size="sm"
                            >
                                Fill Out Form
                            </Button>
                        </GridItem>
                    ))}
                </Grid>
            ) : (
                <Text>No public templates available.</Text>
            )}
        </Box>
    );
}

export default HomePage;
