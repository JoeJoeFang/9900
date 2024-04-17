import React, {useState, useEffect} from 'react';
import {useTheme,IconButton,Box, TextField, Button, Typography, Stack, Select, MenuItem, InputLabel} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timer, setTimer] = useState(null);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const theme = useTheme();

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

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

    const handleSendCode = async () => {
        console.log('Send verification code to:', email);
        try {
            const response = await axios.post('http://localhost:5005/user/auth/send_email', {
                email: email,
                role: role
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response)
            if (response.status === 200) {
                setIsCodeSent(true);
                setTimer(120);
            }
        } catch (errorResponse) {
            alert(errorResponse.response.data.message);
        }
    };

    const handleVerifyCode = async () => {
        console.log('Verification code:', email);
        try {
            const response = await axios.post('http://localhost:5005/user/auth/check_token', {
                email: email,
                role: role,
                token: code
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response)
            if (response.status === 200) {
                console.log('Code verified:', code);
                setIsCodeVerified(true);
           
            } else {
                alert('Verification failed. Please try again.');
            }
        } catch (errorResponse) {
            alert(errorResponse.response.data.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordPattern.test(newPassword)) {
            alert('Password must be at least 6 characters long, include a number, a lowercase letter, and an uppercase letter.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('The passwords do not match. Please try again.');
            return;
        }

        console.log('Reset password for:', email);
        try {
            const response = await axios.post('http://localhost:5005/user/auth/reset_password', {
                email: email,
                role: role,
                token: code,
                password: newPassword,
                confirm_password: confirmPassword,
           },   {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response)
            if (response.status === 200) {
                alert('Your password has been reset successfully!');
                navigate(`/combined-login?role=${role}`);
            } else {
                alert('Update password failed. Please try again.');
            }
        } catch (errorResponse) {
            alert(errorResponse.response.data.message);
        }
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
            <IconButton
                onClick={handleBack}
                size="large"
                sx={{
                    position: 'absolute',
                    left: theme.spacing(2),
                    top: theme.spacing(2),
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                    },
                    boxShadow: 3,
                }}
            >
                <ArrowBackIcon sx={{ fontSize: 28 }} />
            </IconButton>
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
                        <InputLabel>Role</InputLabel>
                        <Select
                            required
                            fullWidth
                            sx={{mb: 2}}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="" disabled>
                                Select Role
                            </MenuItem>
                            <MenuItem value={'Host'}>Host</MenuItem>
                            <MenuItem value={'Customer'}>Customer</MenuItem>
                        </Select>

                        <TextField
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            sx={{mb: 2}}
                        />
                        
                        <Button
                                    onClick={handleSendCode}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    disabled={isCodeSent && timer !== null} // Disable button when the timer is active
                                >
                                    {isCodeSent && timer !== null ? `Resend Code (${timer}s)` : 'Send Code'} 
                                </Button>

                                {/* Verification code input and button are always visible */}
                                <Stack direction="row" spacing={2} alignItems="center" mb={2} sx={{ width: '100%' }}>
                                    <TextField
                                        label="Verification Code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        fullWidth
                                        sx={{ flex: 1 }}
                                        disabled={isCodeVerified}
                                    />
                                    <Button
                                        onClick={handleVerifyCode}
                                        variant="contained"
                                        color="primary"
                                        disabled={isCodeVerified}
                                    >
                                        Verify
                                    </Button>
                                </Stack>
                                {isCodeSent && timer !== null && (
                                    <Typography variant="body2" sx={{ ml: 2 }}>
                                        Please enter the code sent to your email. {timer}s left to verify.
                                    </Typography>
                                )}
                                {isCodeSent && timer === null && (
                                    <Typography variant="body2" sx={{ ml: 2, color: 'error.main' }}>
                                        The verification code has expired. Please send a new code.
                                    </Typography>
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
                            sx={{mb: 2}}
                            error={newPassword && !new RegExp("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}").test(newPassword)}
                            helperText={newPassword && !new RegExp("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}").test(newPassword)
                            ? "Password must be at least 6 characters long, include a number, a lowercase letter, and an uppercase letter."
                            : ' '}
                            inputProps={{
                                pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}",
                                title: "Password must be at least 6 characters long, include a number, a lowercase letter, and an uppercase letter."
                            }}
                        />
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            fullWidth
                            sx={{mb: 2}}
                            error={confirmPassword && newPassword !== confirmPassword}
                            helperText={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match.' : ' '}
                            inputProps={{
                                pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}",
                                title: "Password must be at least 6 characters long, include a number, a lowercase letter, and an uppercase letter."
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            Reset Password
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
};
