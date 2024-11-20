import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getArticleDetails, updateArticle } from '../../api/endpoints';

const EditArticle = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        longDescription: '',
        mainImageUrl: '',
        sourceUrl: ''
    });

    useEffect(() => {
        fetchArticleDetails();
    }, [id]);

    const fetchArticleDetails = async () => {
        try {
            setInitialLoading(true);
            const article = await getArticleDetails(id);
            setFormData({
                title: article.title,
                shortDescription: article.shortDescription,
                longDescription: article.longDescription,
                mainImageUrl: article.mainImageUrl,
                sourceUrl: article.sourceUrl
            });
        } catch (error) {
            console.error('Error fetching article details:', error);
            navigate('/404');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.shortDescription || !formData.longDescription) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            await updateArticle(id, formData);
            navigate(`/article/${id}`);
        } catch (error) {
            console.error('Error updating article:', error);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Article
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        name="title"
                        label="Title"
                        required
                        fullWidth
                        value={formData.title}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        name="shortDescription"
                        label="Short Description"
                        required
                        fullWidth
                        value={formData.shortDescription}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={2}
                    />

                    <TextField
                        name="longDescription"
                        label="Long Description"
                        required
                        fullWidth
                        value={formData.longDescription}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={6}
                    />

                    <TextField
                        name="mainImageUrl"
                        label="Main Image URL"
                        fullWidth
                        value={formData.mainImageUrl}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                    />

                    <TextField
                        name="sourceUrl"
                        label="Source URL"
                        fullWidth
                        value={formData.sourceUrl}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                    />

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            sx={{ minWidth: 120 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <ToastContainer position="bottom-right" />
        </Container>
    );
};

export default EditArticle;