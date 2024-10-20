import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Flex,
    HStack,
    Link,
    Button,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';

function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <HStack spacing={8} alignItems={'center'}>
                    <Link as={RouterLink} to="/">
                        Home
                    </Link>
                    {isAuthenticated && (
                        <>
                            <Link as={RouterLink} to="/dashboard">
                                Dashboard
                            </Link>
                            <Link as={RouterLink} to="/templates/create">
                                Create Template
                            </Link>
                        </>
                    )}
                </HStack>
                <Flex alignItems={'center'}>
                    <Button onClick={toggleColorMode} mr={4}>
                        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
                    </Button>
                    {isAuthenticated ? (
                        <Button colorScheme="red" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button as={RouterLink} to="/login" mr={2}>
                                Login
                            </Button>
                            <Button as={RouterLink} to="/register">
                                Register
                            </Button>
                        </>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
}

export default Navbar;
