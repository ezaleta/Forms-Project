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

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast({
                title: 'Error fetching users.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async userId => {
        try {
            await api.delete(`/api/admin/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            toast({
                title: 'User deleted successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast({
                title: 'Error deleting user.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const promoteUser = async userId => {
        try {
            await api.put(`/api/admin/users/${userId}/promote`);
            setUsers(
                users.map(user =>
                    user.id === userId ? { ...user, isAdmin: true } : user
                )
            );
            toast({
                title: 'User promoted to admin.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error promoting user:', error);
            toast({
                title: 'Error promoting user.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const demoteUser = async userId => {
        try {
            await api.put(`/api/admin/users/${userId}/demote`);
            setUsers(
                users.map(user =>
                    user.id === userId ? { ...user, isAdmin: false } : user
                )
            );
            toast({
                title: 'User demoted from admin.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error demoting user:', error);
            toast({
                title: 'Error demoting user.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={5}>
            <Heading mb={4}>Manage Users</Heading>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users.map(user => (
                        <Tr key={user.id}>
                            <Td>
                                {user.firstName} {user.lastName}
                            </Td>
                            <Td>{user.email}</Td>
                            <Td>{user.isAdmin ? 'Admin' : 'User'}</Td>
                            <Td>
                                <Button
                                    colorScheme="red"
                                    size="sm"
                                    mr={2}
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Delete
                                </Button>
                                {user.isAdmin ? (
                                    <Button
                                        colorScheme="yellow"
                                        size="sm"
                                        onClick={() => demoteUser(user.id)}
                                    >
                                        Demote
                                    </Button>
                                ) : (
                                    <Button
                                        colorScheme="green"
                                        size="sm"
                                        onClick={() => promoteUser(user.id)}
                                    >
                                        Promote
                                    </Button>
                                )}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}

export default AdminUsersPage;
