import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createArticle } from '../../api/endpoints';

const CreateArticle = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        longDescription: '',
        mainImageUrl: '',
        sourceUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title || !formData.shortDescription || !formData.longDescription) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const response = await createArticle(formData);
            navigate('/');
        } catch (error) {
            console.error('Error creating article:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create New Article
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
                        placeholder="https://example.com/image.jpg"
                    />

                    <TextField
                        name="sourceUrl"
                        label="Source URL"
                        fullWidth
                        value={formData.sourceUrl}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="https://example.com/article"
                    />

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            sx={{ minWidth: 120 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Create Article'}
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

export default CreateArticle;