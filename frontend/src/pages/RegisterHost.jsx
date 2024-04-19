//sijia han
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, useTheme, Snackbar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import HeaderLogo from "../components/HeaderLogo";


const RegisterHost = () => {
    const theme = useTheme();
    const navigate = useNavigate();


    const [registerData, setRegisterData] = useState({
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    
    const [, setOpenDialog] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('info'); 

    const handleBack = () => navigate(-1);
    
    const updateField = (e) => {
        setRegisterData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };


    const registerUser = async (e) => {
        e.preventDefault();
    
        // Check if passwords match
        if (registerData.password !== registerData.confirmPassword) {
            setSnackbarMessage("Passwords do not match.");
            setOpenSnackbar(true);
            return;
        }
    
        // Attempt to register the host
        try {
            console.log(registerData)
            const response = await axios.post('http://localhost:5005/user/auth/host_register', {
                companyName: registerData.companyName,
                email: registerData.email,
                password: registerData.password,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            // If registration is successful
            if (response.status === 201) {
                console.log("Registration is successful, setting the snackbar message.");
                setSnackbarMessage("Registration successful!");
                setSnackbarType('success')
                setOpenDialog(true); 

                setTimeout(() => {
                    navigate('/combined-login?role=host'); // Redirect to the all events page
                }, 500); // Adjust delay as necessary
    
                console.log('Register successfully');
            }
        } catch (errorResponse) {
            // Handle registration errors
            let errorMessage = 'An unexpected error occurred during registration.';
            if (errorResponse.response) {
                const status = errorResponse.response.status;
                const message = errorResponse.response.data.message;
    
                if (status === 400 || status === 401) {
                    // Custom error message for duplicate email
                    errorMessage = message.includes('email already exists') ? 'This email is already in use. Please use a different email address.' : message;
                }
            }
            setSnackbarMessage(errorMessage);
            setOpenSnackbar(true);
        }
    };
    const action = (
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
        </IconButton>
    );
    return (        
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
            <HeaderLogo theme={theme} />

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '90%', maxWidth: 1200 }}>

                <Box sx={{
                    width: '50%',
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
                            error={registerData.companyName && (registerData.companyName.length < 3 || registerData.companyName.length > 100 ||/\s/.test(registerData.companyName))}
                            helperText={registerData.companyName
                                ? (/\s/.test(registerData.companyName)
                                ? 'CompanyName cannot include spaces.'
                                :
                                    registerData.companyName.length < 3
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
                           <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            ContentProps={{
                style: {
                    backgroundColor: snackbarType === 'success' ? theme.palette.success.main : theme.palette.error.main,
                },
            }}
            action={action} // Use the action component here
        />
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
                            onClick={() => navigate('/combined-login?role=host')}
                        >
                            Already have an account? Login
                        </Button>

                        
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterHost;