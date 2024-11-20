// ArticleDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Divider,
    CircularProgress,
    Paper,
    Avatar,
    Button,
    TextField,
    Grid
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    Bookmark,
    BookmarkBorder,
    Share, DeleteOutline, Edit,
} from '@mui/icons-material';
import {
    createComment, createReply, deleteArticle, deleteComment, deleteReply,
    getArticleComments,
    getArticleDetails, getCommentReplies, toggleArticleBookmark, toggleArticleHeart,
} from '../../api/endpoints';
import {toast} from "react-toastify";
import { Reply } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);

    useEffect(() => {
        fetchArticleDetails();
        fetchComments();
    }, [id]);

    const fetchArticleDetails = async () => {
        try {
            const data = await getArticleDetails(id);
            setArticle(data);
        } catch (error) {
            console.error('Error fetching article details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (page = 1) => {
        try {
            const data = await getArticleComments(id, page);
            if (page === 1) {
                setComments(data);
            } else {
                setComments(prev => [...prev, ...data]);
            }
            setHasMoreComments(data.length === 10); // Assuming limit is 10
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleHeart = async () => {
        try {
            await toggleArticleHeart(id);
            // Optimistically update UI
            setArticle(prevArticle => ({
                ...prevArticle,
                hearted: !prevArticle.hearted,
                heartCount: prevArticle.hearted
                    ? prevArticle.heartCount - 1
                    : prevArticle.heartCount + 1
            }));
            toast.success(article.hearted
                ? 'Removed from favorites'
                : 'Added to favorites'
            );
        } catch (error) {
            // Revert on error
            setArticle(prevArticle => ({
                ...prevArticle,
                hearted: !prevArticle.hearted,
                heartCount: prevArticle.hearted
                    ? prevArticle.heartCount - 1
                    : prevArticle.heartCount + 1
            }));
            toast.error(error);
        }
    };

    const handleShare = async () => {
        try {
            // Get the current URL
            const articleUrl = window.location.href;

            // Try to use the modern navigator.clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(articleUrl);
                toast.success('Link copied to clipboard!');
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = articleUrl;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    toast.success('Link copied to clipboard!');
                } catch (err) {
                    toast.error('Failed to copy link');
                }
                document.body.removeChild(textArea);
            }
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const handleBookmark = async () => {
        try {
            await toggleArticleBookmark(id);
            // Optimistically update UI
            setArticle(prevArticle => ({
                ...prevArticle,
                bookmarked: !prevArticle.bookmarked,
                bookmarkCount: prevArticle.bookmarked
                    ? prevArticle.bookmarkCount - 1
                    : prevArticle.bookmarkCount + 1
            }));
            toast.success(article.bookmarked
                ? 'Removed from bookmarks'
                : 'Added to bookmarks'
            );
        } catch (error) {
            // Revert on error
            setArticle(prevArticle => ({
                ...prevArticle,
                bookmarked: !prevArticle.bookmarked,
                bookmarkCount: prevArticle.bookmarked
                    ? prevArticle.bookmarkCount - 1
                    : prevArticle.bookmarkCount + 1
            }));
            toast.error('Error updating bookmark status');
        }
    };


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const newCommentData = await createComment(id, newComment);
            setNewComment('');
            // Reset comment page
            setCommentPage(1);
            // Add the new comment to the beginning of the list
            setComments(prevComments => [newCommentData, ...prevComments]);
            // Update article comment count
            setArticle(prevArticle => ({
                ...prevArticle,
                commentCount: prevArticle.commentCount + 1
            }));
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(prevComments =>
                prevComments.filter(comment => comment.id !== commentId)
            );
            setArticle(prevArticle => ({
                ...prevArticle,
                commentCount: prevArticle.commentCount - 1
            }));
            toast.success('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };



    const handleDeleteReply = async (replyId) => {
        try {
            await deleteReply(replyId);
            toast.success('Reply deleted successfully');

        } catch (error) {
            console.error('Error deleting reply:', error);
            toast.error('Failed to delete reply');
            throw error; // Propagate error to CommentItem component
        }
    };

    const handleDeleteArticle = async () => {
        try {
            await deleteArticle(id);
            toast.success('Article deleted successfully');

        } catch (error) {
            console.error('Error deleting article:', error);
            toast.error('Failed to delete article');
        }
    };

    const handleLoadMoreComments = () => {
        setCommentPage(prev => prev + 1);
        fetchComments(commentPage + 1);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!article) {
        return (
            <Container>
                <Typography variant="h5" sx={{ mt: 4 }}>Article not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card sx={{ mb: 4, boxShadow: 3 }}>
                <CardMedia
                    component="img"
                    height="400"
                    image={article.mainImageUrl}
                    alt={article.title}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {article.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={article.publisher.avatarUrl} sx={{ mr: 2 }} />
                        <Box>
                            <Typography variant="subtitle1">
                                {article.publisher.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {article.timeAgo}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Update the action buttons section */}
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 3,
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex', gap: 2 }}> {/* Left group */}
                            <IconButton
                                onClick={handleHeart}
                                color="primary"
                            >
                                {article.hearted ? <Favorite /> : <FavoriteBorder />}
                                <Typography sx={{ ml: 1 }}>{article.heartCount}</Typography>
                            </IconButton>
                            <IconButton
                                onClick={handleBookmark}
                                color="primary"
                            >
                                {article.bookmarked ? <Bookmark /> : <BookmarkBorder />}
                                <Typography sx={{ ml: 1 }}>{article.bookmarkCount}</Typography>
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}> {/* Right group */}
                            <IconButton
                                color="primary"
                                onClick={handleShare}
                                title="Share article"
                            >
                                <Share />
                            </IconButton>
                            {localStorage.getItem('id') === article.publisher.id && (
                                <>
                                    <IconButton
                                        color="primary"
                                        component={Link}
                                        to={`/article/edit/${article.id}`}
                                        title="Edit Article"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={handleDeleteArticle}
                                        color="primary"
                                        title="Delete Article"
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </Box>
                    <Typography variant="body1" paragraph>
                        {article.shortDescription}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {article.longDescription}
                    </Typography>

                    {article.sourceUrl && (
                        <Button
                            variant="outlined"
                            href={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ mt: 3 }}
                        >
                            Read Original Article
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Comments Section */}
            <Paper sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Comments ({article.commentCount})
                </Typography>

                <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!newComment.trim()}
                    >
                        Post Comment
                    </Button>
                </Box>

                <Grid container spacing={2} direction="column">
                    {comments.map((comment) => (
                        <Grid item key={comment.id}>
                            <CommentItem
                                comment={comment}
                                onDeleteComment={handleDeleteComment}
                                onDeleteReply={handleDeleteReply}
                            />
                        </Grid>
                    ))}
                </Grid>

                {hasMoreComments && (
                    <Button
                        fullWidth
                        onClick={handleLoadMoreComments}
                        sx={{ mt: 2 }}
                    >
                        Load More Comments
                    </Button>
                )}
            </Paper>
        </Container>
    );
};

export default ArticleDetail;




const CommentItem = ({ comment, onDeleteComment, onDeleteReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [replyPage, setReplyPage] = useState(1);
    const [hasMoreReplies, setHasMoreReplies] = useState(true);

    const isCommentOwner = localStorage.getItem('id') === comment.user.id;


    const fetchReplies = async (page = 1) => {
        try {
            const data = await getCommentReplies(comment.id, page);
            if (page === 1) {
                setReplies(data);
            } else {
                setReplies(prev => [...prev, ...data]);
            }
            setHasMoreReplies(data.length === 10);
        } catch (error) {
            console.error('Error fetching replies:', error);
            toast.error('Failed to load replies');
        }
    };

    const handleLoadMoreReplies = () => {
        setReplyPage(prev => prev + 1);
        fetchReplies(replyPage + 1);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            const newReply = await createReply(comment.id, replyContent);
            setReplyContent('');
            setShowReplyForm(false);
            setReplies(prev => [newReply, ...prev]);
            if (!showReplies) {
                setShowReplies(true);
                fetchReplies();
            }
        } catch (error) {
            console.error('Error adding reply:', error);
            toast.error('Failed to add reply');
        }
    };


    const handleReplyDelete = async (replyId) => {
        try {
            await onDeleteReply(replyId);
            // Update local state immediately after successful deletion
            setReplies(prevReplies => prevReplies.filter(reply => reply.id !== replyId));
        } catch (error) {
            console.error('Error deleting reply:', error);
            toast.error('Failed to delete reply');
        }
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={comment.user.avatarUrl} sx={{ mr: 2 }} />
                    <Box>
                        <Typography variant="subtitle2">
                            {comment.user.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>

                {isCommentOwner && (
                    <IconButton
                        size="small"
                        onClick={() => onDeleteComment(comment.id)}
                        sx={{ ml: 1 }}
                    >
                        <DeleteOutline fontSize="small" />
                    </IconButton>
                )}
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>{comment.content}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Button
                    size="small"
                    startIcon={<Reply />}
                    onClick={() => setShowReplyForm(!showReplyForm)}
                >
                    Reply
                </Button>
                {comment.replyCount > 0 && (
                    <Button
                        size="small"
                        onClick={() => {
                            if (!showReplies) {
                                fetchReplies();
                            }
                            setShowReplies(!showReplies);
                        }}
                    >
                        {showReplies ? 'Hide Replies' : `Show Replies (${comment.replyCount})`}
                    </Button>
                )}
            </Box>

            {showReplyForm && (
                <Box component="form" onSubmit={handleReplySubmit} sx={{ ml: 4, mb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            type="submit"
                            disabled={!replyContent.trim()}
                        >
                            Reply
                        </Button>
                        <Button
                            size="small"
                            onClick={() => setShowReplyForm(false)}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            )}

            {showReplies && (
                <Box sx={{ ml: 4 }}>
                    {replies.map((reply) => (
                        <Paper key={reply.id} sx={{ p: 2, mb: 1, bgcolor: 'action.hover' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar src={reply.user.avatarUrl} sx={{ mr: 2, width: 24, height: 24 }} />
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>
                                            {reply.user.username}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(reply.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>

                                {localStorage.getItem('id') === reply.user.id && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleReplyDelete(reply.id)}
                                    >
                                        <DeleteOutline fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography variant="body2">{reply.content}</Typography>
                        </Paper>
                    ))}
                    {hasMoreReplies && (
                        <Button
                            size="small"
                            onClick={handleLoadMoreReplies}
                            sx={{ mt: 1 }}
                        >
                            Load More Replies
                        </Button>
                    )}
                </Box>
            )}
        </Paper>
    );
};