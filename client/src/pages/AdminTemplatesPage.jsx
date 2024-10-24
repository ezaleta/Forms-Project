import React, { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function AdminTemplatesPage() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/api/admin/templates');
            setTemplates(res.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
            toast({
                title: 'Error fetching templates.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const deleteTemplate = async templateId => {
        try {
            await api.delete(`/api/admin/templates/${templateId}`);
            setTemplates(
                templates.filter(template => template.id !== templateId)
            );
            toast({
                title: 'Template deleted successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting template:', error);
            toast({
                title: 'Error deleting template.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={5}>
            <Heading mb={4}>Manage Templates</Heading>
            {loading ? (
                <Box textAlign="center" py={10}>
                    <Spinner size="xl" />
                </Box>
            ) : (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Author</Th>
                            <Th>Created At</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {templates.map(template => (
                            <Tr key={template.id}>
                                <Td>{template.title}</Td>
                                <Td>
                                    {template.author.firstName}
                                    {template.author.lastName}
                                </Td>
                                <Td>
                                    {new Date(
                                        template.createdAt
                                    ).toLocaleString()}
                                </Td>
                                <Td>
                                    <Button
                                        colorScheme="red"
                                        size="sm"
                                        mr={2}
                                        onClick={() =>
                                            deleteTemplate(template.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        colorScheme="blue"
                                        size="sm"
                                        onClick={() =>
                                            navigate(
                                                `/templates/edit/${template.id}`
                                            )
                                        }
                                    >
                                        Edit
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </Box>
    );
}

export default AdminTemplatesPage;
