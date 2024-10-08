import React from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';

function DashboardPage() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <Box p={5}>
            <Heading>Dashboard</Heading>
            <Button colorScheme="red" mt={4} onClick={handleLogout}>
                Logout
            </Button>
        </Box>
    );
}

export default DashboardPage;
