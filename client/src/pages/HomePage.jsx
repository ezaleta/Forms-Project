import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <Box p={5}>
            <Heading>Welcome!</Heading>
            <Text mt={4}>
                Create and share custom forms, quizzes, and questionnaires with
                ease.
            </Text>
        </Box>
    );
}

export default HomePage;
