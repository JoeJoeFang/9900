import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timer, setTimer] = useState(null);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsCodeSent(false);
            setTimer(null);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendCode = () => {
        console.log('Send verification code to:', email);
        setIsCodeSent(true);
        setTimer(60);
    };

    const handleVerifyCode = () => {
        if (code === '123456') {
            console.log('Code verified:', code);
            setIsCodeVerified(true);
        } else {
            alert('Verification failed. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert('The passwords do not match. Please try again.');
            return;
        }

        console.log('Reset password for:', email);
        alert('Your password has been reset successfully!');
        navigate('/login');
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: `url(${process.env.PUBLIC_URL}/default_background.jpg), linear-gradient(to right, #e66465, #9198e5)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 4,
        }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 5,
                    boxShadow: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
            >
                <Typography variant="h4" component="h1" sx={{
                    mb: 9,
                    fontWeight: 'bold',
                    color: 'primary.main',
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}>
                    Reset Password
                </Typography>
                {!isCodeVerified && (
                    <>
                        <TextField
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        {isCodeSent ? (
                            <Stack direction="row" spacing={2} alignItems="center" mb={2} sx={{ width: '100%' }}>
                                <TextField
                                    label="Verification Code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    fullWidth
                                    sx={{ flex: 1 }}
                                />
                                <Button
                                    onClick={handleVerifyCode}
                                    variant="contained"
                                    color="primary"
                                >
                                    Verify
                                </Button>
                                {timer && (
                                    <Typography variant="body2" sx={{ ml: 2 }}>
                                        {timer}s
                                    </Typography>
                                )}
                            </Stack>
                        ) : (
                            <Button
                                onClick={handleSendCode}
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mb: 2 }}
                                disabled={isCodeSent}
                            >
                                Send Code
                            </Button>
                        )}
                    </>
                )}
                {isCodeVerified && (
                    <>
                        <TextField
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Reset Password
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
};
