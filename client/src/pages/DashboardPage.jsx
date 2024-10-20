import React from 'react';
import {
    Box,
    Heading,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';

function DashboardPage() {
    const [templates, setTemplates] = useState([]);
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchTemplates = async () => {
            const res = await api.get('/api/templates/mine');
            setTemplates(res.data);
        };
        const fetchForms = async () => {
            const res = await api.get('/api/forms/mine');
            setForms(res.data);
        };

        fetchTemplates();
        fetchForms();
    }, []);

    return (
        <Box p={5}>
            <Heading>Dashboard</Heading>
            <Heading size="md" mt={4}>
                My Templates
            </Heading>
            <Button
                as={RouterLink}
                to="/templates/create"
                colorScheme="teal"
                mt={2}
            >
                Create New Template
            </Button>
        </Box>
    );
}

export default DashboardPage;
