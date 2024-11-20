import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {sendEmailVerification, verifyEmail} from "../../api/endpoints";

const EmailVerification = () => {
    const navigate = useNavigate();
    const { verifyingEmail } = useParams();
    const [email, setEmail] = useState(verifyingEmail  || '');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    useEffect(() => {
        handleSendVerificationEmail();
    }, [verifyingEmail]);

    const handleSendVerificationEmail = async () => {
        setLoading(true);
        try {
            await sendEmailVerification(email);
            setCodeSent(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyEmail(email, code);
            navigate('/auth/sign-in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Email Verification
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="code"
                            label="Verification Code"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={handleSendVerificationEmail}
                            disabled={loading}
                        >
                            Resend Verification Code
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default EmailVerification;