//sijia han
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, useTheme, Snackbar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const RegisterHost = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [openDialog, setOpenDialog] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleBack = () => navigate(-1);
    
    const updateField = (e) => {
        setRegisterData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const registerUser = async (e) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            setSnackbarMessage("Passwords do not match.");
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5005/user/auth/register', {
                companyName: registerData.companyName,
                email: registerData.email,
                password: registerData.password,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 201) { 
                setOpenDialog(true);
                console.log(
                    'register successfully'
                );
            }
        } catch (errorResponse) {
            const errorMessage = errorResponse.response?.data?.error || 'An unexpected error occurred';
            alert(errorMessage);
        }
    };
    return (
        <>
            <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: `url(${process.env.PUBLIC_URL}/default_background.jpg), linear-gradient(to right, #e66465, #9198e5)`,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            p: theme.spacing(2),
        }}>
            {/* Content similar to the login page, adjusted for registration */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
                <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Join Our Amazing Ticket Platform
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%', maxWidth: 1200 }}>
                <Box sx={{ color: 'white', width: '40%', p: 3, borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2, color: 'white', fontWeight: 'medium' }}>
                        Sign up to discover the best events near you
                    </Typography>
                </Box>

                <Box sx={{
                    width: '40%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: theme.shape.borderRadius,
                    p: theme.spacing(4),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
                        Create Your  Host Account
                    </Typography>

                    <Box component="form" onSubmit={registerUser} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="companyName"
                            label="Company Name"
                            name="companyName"
                            autoComplete="company-name"
                            value={registerData.companyName}
                            onChange={updateField}
                            error={registerData.companyName && (registerData.companyName.length < 3 || registerData.companyName.length > 100)}
                            helperText={registerData.companyName
                                ? (registerData.companyName.length < 3
                                    ? 'CompanyName must be at least 3 characters long.'
                                    : registerData.companyName.length > 100
                                        ? 'CompanyName cannot be more than 100 characters long.'
                                        : '')
                                : ' '} />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={registerData.email}
                            onChange={updateField}
                            error={!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerData.email) && registerData.email !== ''}
                            helperText={!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerData.email) && registerData.email !== '' ? 'Enter a valid email address.' : ' '} />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={registerData.password}
                            onChange={updateField}
                            inputProps={{
                                pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}",
                                title: "Password must be at least 6 characters long, include a number, a lowercase letter, and an uppercase letter."
                            }}
                            // Include the error and helperText properties using the same pattern and title
                            error={registerData.password && !new RegExp("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}").test(registerData.password)}
                            helperText={registerData.password && !new RegExp("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}").test(registerData.password) ? "Password must be at least 6 characters long, include a number, a lowercase letter, and an uppercase letter." : ' '} />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={registerData.confirmPassword}
                            onChange={updateField}
                            error={registerData.confirmPassword && registerData.password !== registerData.confirmPassword}
                            helperText={registerData.confirmPassword && registerData.password !== registerData.confirmPassword ? 'Passwords do not match.' : ' '} />
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={registerUser}
                        >
                            Register
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/login-host')}
                        >
                            Already have an account? Login
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
        <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Event Created Successfully"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Your account has been created successfully.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                navigate('/login-host'); // 替换为你希望跳转到的路径
                                setOpenDialog(false);
                            }}>Login Now</Button>
                        </DialogActions>
                    </Dialog> </>
    );
};

export default RegisterHost;