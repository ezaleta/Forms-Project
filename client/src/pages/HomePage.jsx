import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <Box p={5}>
            <Heading>Welcome to the Customizable Forms App</Heading>
            <Text mt={4}>Please register or login to continue.</Text>
            <Button as={Link} to="/register" colorScheme="teal" mt={4} mr={2}>
                Register
            </Button>
            <Button as={Link} to="/login" colorScheme="blue" mt={4}>
                Login
            </Button>
        </Box>
    );
}

export default HomePage;
