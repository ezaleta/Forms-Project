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
    Textarea,
    FormControl,
    FormLabel,
    VStack,
    Avatar,
    HStack,
    IconButton,
    useToast,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import api from '../services/api';

function TemplatePage() {
    const { id } = useParams();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likesCount, setLikesCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [userId, setUserId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemplateData = async () => {
            try {
                const templateRes = await api.get(`/api/templates/${id}`);
                setTemplate(templateRes.data);

                const commentsRes = await api.get(
                    `/api/templates/${id}/comments`
                );
                setComments(commentsRes.data);

                const likesRes = await api.get(`/api/templates/${id}/likes`);
                setLikesCount(likesRes.data.likesCount);

                try {
                    const hasLikedRes = await api.get(
                        `/api/templates/${id}/hasLiked`
                    );
                    setHasLiked(hasLikedRes.data.hasLiked);
                } catch (err) {
                    console.error('Error checking like status:', err);
                }

                const userRes = await api.get('/api/users/me');
                setUserId(userRes.data.id);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load template data');
            } finally {
                setLoading(false);
            }
        };

        const fetchTemplate = async () => {
            try {
                const res = await api.get(`/api/templates/${id}`);
                setTemplate(res.data);
            } catch (error) {
                console.error('Error fetching template:', error);
                toast({
                    title: 'Error loading template.',
                    description: 'Unable to load template data.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchTemplate();
        fetchTemplateData();
    }, [id]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const res = await api.post(`/api/templates/${id}/comments`, {
                content: newComment,
            });
            setComments([...comments, res.data]);
            setNewComment('');
            toast({
                title: 'Comment added.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            toast({
                title: 'Error adding comment.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const deleteComment = async commentId => {
        try {
            await api.delete(`/api/templates/${id}/comments/${commentId}`);
            setComments(comments.filter(comment => comment.id !== commentId));
            toast({
                title: 'Comment deleted.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast({
                title: 'Error deleting comment.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditingCommentContent(content);
    };

    const handleUpdateComment = async () => {
        try {
            const res = await api.put(
                `/api/templates/${id}/comments/${editingCommentId}`,
                {
                    content: editingCommentContent,
                }
            );
            setComments(
                comments.map(comment =>
                    comment.id === editingCommentId ? res.data : comment
                )
            );
            setEditingCommentId(null);
            setEditingCommentContent('');
            toast({
                title: 'Comment updated.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error updating comment:', error);
            toast({
                title: 'Error updating comment.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingCommentContent('');
    };

    const handleToggleLike = async () => {
        try {
            await api.post(`/api/templates/${id}/like`);
            setHasLiked(!hasLiked);
            setLikesCount(prevLikesCount =>
                hasLiked ? prevLikesCount - 1 : prevLikesCount + 1
            );
        } catch (error) {
            console.error('Error toggling like:', error);
            toast({
                title: 'Error toggling like.',
                status: 'error',
                duration: 3000,
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

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Box p={5}>
            <Heading mb={4}>{template.title}</Heading>
            <Text mb={4}>{template.description}</Text>
            <Button
                colorScheme={hasLiked ? 'red' : 'teal'}
                onClick={handleToggleLike}
                mb={4}
            >
                {hasLiked ? `Unlike (${likesCount})` : `Like (${likesCount})`}
            </Button>

            <Heading size="md" mt={8} mb={4}>
                Comments
            </Heading>
            <Stack spacing={4}>
                {comments.map(comment => (
                    <Box
                        key={comment.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                    >
                        <HStack justifyContent="space-between">
                            <HStack>
                                <Avatar
                                    size="sm"
                                    name={`${comment.User.firstName} ${comment.User.lastName}`}
                                />
                                <Text fontWeight="bold">
                                    {comment.User.firstName}{' '}
                                    {comment.User.lastName}
                                </Text>
                            </HStack>
                            {comment.userId === userId && (
                                <HStack spacing={2}>
                                    <IconButton
                                        size="sm"
                                        icon={<EditIcon />}
                                        onClick={() =>
                                            handleEditComment(
                                                comment.id,
                                                comment.content
                                            )
                                        }
                                        aria-label="Edit Comment"
                                    />
                                    <IconButton
                                        size="sm"
                                        icon={<DeleteIcon />}
                                        onClick={() =>
                                            deleteComment(comment.id)
                                        }
                                        aria-label="Delete Comment"
                                    />
                                </HStack>
                            )}
                        </HStack>
                        {editingCommentId === comment.id ? (
                            <VStack mt={2} align="stretch">
                                <Textarea
                                    value={editingCommentContent}
                                    onChange={e =>
                                        setEditingCommentContent(e.target.value)
                                    }
                                />
                                <HStack>
                                    <Button
                                        size="sm"
                                        colorScheme="teal"
                                        onClick={handleUpdateComment}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                </HStack>
                            </VStack>
                        ) : (
                            <Text mt={2}>{comment.content}</Text>
                        )}
                    </Box>
                ))}
            </Stack>

            <VStack spacing={4} mt={4} align="stretch">
                <FormControl>
                    <FormLabel>Add a comment</FormLabel>
                    <Textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Enter your comment"
                    />
                </FormControl>
                <Button
                    onClick={handleAddComment}
                    colorScheme="teal"
                    alignSelf="flex-end"
                >
                    Submit Comment
                </Button>
                <Button
                    colorScheme="teal"
                    alignSelf="flex-end"
                    onClick={() => navigate(`/templates/${id}/fill`)}
                >
                    Fill Out Form
                </Button>
            </VStack>
        </Box>
    );
}

export default TemplatePage;
