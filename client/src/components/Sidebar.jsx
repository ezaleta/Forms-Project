import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    VStack,
    Link as ChakraLink,
    Button,
    Text,
    IconButton,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    CloseButton,
    Flex,
    Heading,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { jwtDecode } from 'jwt-decode';

function Sidebar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const isAuthenticated = !!localStorage.getItem('token');
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isAdmin, setIsAdmin] = useState(false);
    const token = localStorage.getItem('token');
    let decoded = null;

    if (token) {
        decoded = jwtDecode(token);
    }

    useEffect(() => {
        if (decoded && decoded.isAdmin) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [decoded]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <Box display={{ base: 'block', md: 'none' }} p={4}>
                <IconButton
                    onClick={isOpen ? onClose : onOpen}
                    icon={<HamburgerIcon />}
                    aria-label="Toggle Navigation"
                    variant="outline"
                />
            </Box>
            <Flex
                direction="column"
                pos="fixed"
                left="0"
                h="100%"
                p={4}
                w={{ base: isOpen ? 'full' : '0', md: '250px' }}
                bg={useColorModeValue('gray.100', 'gray.900')}
                borderRightWidth="1px"
                borderRightColor={useColorModeValue('gray.200', 'gray.700')}
                overflowX="hidden"
                transition="width 0.2s ease"
                zIndex={20}
            >
                {isOpen || window.innerWidth >= 768 ? (
                    <>
                        {isOpen && (
                            <Box
                                display={{ base: 'block', md: 'none' }}
                                alignSelf="flex-end"
                                mb={4}
                            >
                                <CloseButton onClick={onClose} />
                            </Box>
                        )}
                        <Box>
                            <Heading
                                as="h3"
                                size="lg"
                                mb={4}
                                color={useColorModeValue(
                                    'teal.600',
                                    'teal.300'
                                )}
                            >
                                FormsApp
                            </Heading>
                        </Box>
                        <VStack align="stretch" spacing={4} mt={4}>
                            <ChakraLink
                                as={RouterLink}
                                to="/"
                                color={useColorModeValue(
                                    'teal.700',
                                    'teal.300'
                                )}
                            >
                                Home
                            </ChakraLink>
                            {isAuthenticated && (
                                <>
                                    <ChakraLink
                                        as={RouterLink}
                                        to="/dashboard"
                                        color={useColorModeValue(
                                            'teal.700',
                                            'teal.300'
                                        )}
                                    >
                                        Dashboard
                                    </ChakraLink>
                                    <ChakraLink
                                        as={RouterLink}
                                        to="/templates/create"
                                        color={useColorModeValue(
                                            'teal.700',
                                            'teal.300'
                                        )}
                                    >
                                        Create Template
                                    </ChakraLink>
                                </>
                            )}
                            {isAdmin && (
                                <>
                                    <ChakraLink
                                        as={RouterLink}
                                        to="/admin/users"
                                        color={useColorModeValue(
                                            'teal.700',
                                            'teal.300'
                                        )}
                                    >
                                        Manage Users
                                    </ChakraLink>
                                    <ChakraLink
                                        as={RouterLink}
                                        to="/admin/templates"
                                        color={useColorModeValue(
                                            'teal.700',
                                            'teal.300'
                                        )}
                                    >
                                        Manage Templates
                                    </ChakraLink>
                                </>
                            )}
                        </VStack>
                        <Box mt={10}>
                            <Button
                                onClick={toggleColorMode}
                                mb={4}
                                width="100%"
                            >
                                Toggle{' '}
                                {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                            </Button>
                            {isAuthenticated ? (
                                <Button
                                    colorScheme="red"
                                    onClick={handleLogout}
                                    width="100%"
                                >
                                    Logout
                                </Button>
                            ) : (
                                <VStack spacing={2}>
                                    <Button
                                        as={RouterLink}
                                        to="/login"
                                        width="100%"
                                    >
                                        Login
                                    </Button>
                                    <Text> - or - </Text>
                                    <Button
                                        as={RouterLink}
                                        to="/register"
                                        width="100%"
                                    >
                                        Register
                                    </Button>
                                </VStack>
                            )}
                        </Box>
                    </>
                ) : null}
            </Flex>
        </Box>
    );
}

export default Sidebar;
