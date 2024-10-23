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
    Tag,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
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

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await api.get(`/api/templates/${id}`);
                setTemplate(res.data);
            } catch (error) {
                console.error('Error fetching template:', error);
                setError('Failed to load template');
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await api.get(`/api/templates/${id}/comments`);
                setComments(res.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const fetchLikesInfo = async () => {
            try {
                const res = await api.get(`/api/templates/${id}/likes`);
                setLikesCount(res.data.likesCount);

                const userLikeRes = await api.get(
                    `/api/templates/${id}/hasLiked`
                );
                setHasLiked(userLikeRes.data.hasLiked);
            } catch (error) {
                console.error('Error fetching likes info:', error);
            }
        };

        fetchTemplate();
        fetchComments();
        fetchLikesInfo();
    }, [id]);

    const handleAddComment = async () => {
        if (!newComment) return;

        try {
            const res = await api.post(`/api/templates/${id}/comments`, {
                content: newComment,
            });
            setComments([...comments, res.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
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
            <Text mb={2}>{template.description}</Text>

            {template.Tags && template.Tags.length > 0 && (
                <Wrap mb={4}>
                    {template.Tags.map(tag => (
                        <WrapItem key={tag.id}>
                            <Tag colorScheme="teal">{tag.name}</Tag>
                        </WrapItem>
                    ))}
                </Wrap>
            )}

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
                        <HStack mb={2}>
                            <Avatar
                                size="sm"
                                name={`${comment.User.firstName} ${comment.User.lastName}`}
                            />
                            <Text fontWeight="bold">
                                {comment.User.firstName} {comment.User.lastName}
                            </Text>
                        </HStack>
                        <Text>{comment.content}</Text>
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
                    colorScheme="blue"
                    alignSelf="flex-end"
                >
                    Submit Comment
                </Button>
            </VStack>
        </Box>
    );
}

export default TemplatePage;
