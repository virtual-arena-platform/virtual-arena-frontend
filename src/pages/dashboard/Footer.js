import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                py: 6,
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            About Us
                        </Typography>
                        <Typography variant="body2">
                            We are dedicated to bringing you the best content and experiences. Our platform connects people through knowledge sharing and meaningful discussions.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
                                Home
                            </Link>
                            <Link component={RouterLink} to="/profile" color="inherit" sx={{ textDecoration: 'none' }}>
                                Profile
                            </Link>
                            <Link component={RouterLink} to="/article/create" color="inherit" sx={{ textDecoration: 'none' }}>
                                Create Article
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Connect With Us
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton color="inherit" aria-label="Facebook">
                                <Facebook />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Twitter">
                                <Twitter />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Instagram">
                                <Instagram />
                            </IconButton>
                            <IconButton color="inherit" aria-label="LinkedIn">
                                <LinkedIn />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{
                    mt: 4,
                    pt: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                }}>
                    <Typography variant="body2">
                        © {new Date().getFullYear()} Virtual Arena. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;