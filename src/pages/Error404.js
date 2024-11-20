import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const Error404 = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 4,
                        borderRadius: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: '8rem',
                            fontWeight: 700,
                            color: 'primary.main',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                            mb: 2,
                        }}
                    >
                        404
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 2,
                        }}
                    >
                        Page Not Found
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            mb: 4,
                            px: 2,
                        }}
                    >
                        Oops! The page you're looking for seems to have vanished into thin air.
                        Don't worry, even the best explorers get lost sometimes.
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate('/')}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                            }}
                        >
                            Back to Home
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                            }}
                        >
                            Go Back
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            mt: 6,
                            pt: 4,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.875rem' }}
                        >
                            If you believe this is a mistake, please contact our support team.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Error404;