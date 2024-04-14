import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box, useTheme, IconButton, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

const RegisterCustomer = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        Name: '',
        email: '',
        password: '',
        confirmPassword: '',
        cardNumber: '',
        cardCVC: '',
        cardExpirationDate: '',
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('info');
    const [expirationDateError, setExpirationDateError] = useState('');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const updateField = (e) => {
        setRegisterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleBack = () => navigate(-1);

    const validateExpirationDate = (expiration) => {
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration)) {
            return false;
        }

        const [expMonth, expYear] = expiration.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (parseInt(expYear, 10) < currentYear || (parseInt(expYear, 10) === currentYear && parseInt(expMonth, 10) < currentMonth)) {
            return false;
        }

        return true;
    };

    const handleExpirationDateChange = (e) => {
        const { value } = e.target;
        let formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);

        if (formattedValue.length > 2) {
            formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2, 4)}`;
        }

        setRegisterData((prevState) => ({
            ...prevState,
            cardExpirationDate: formattedValue,
        }));

        const isValidDate = validateExpirationDate(formattedValue);
        setExpirationDateError(
            isValidDate ? '' : 'Expiration date must be in the future and mm/yy.'
        );
    };

    const registerUser = async (e) => {
        e.preventDefault();

        // Check if the card expiration date is valid
        if (!validateExpirationDate(registerData.cardExpirationDate)) {
            setExpirationDateError('Expiration date must be in the future.');
            setOpenSnackbar(true);
            setSnackbarMessage('Expiration date must be in the future.');
            setSnackbarType('error');
            return;
        }

        // Check if passwords match
        if (registerData.password !== registerData.confirmPassword) {
            setExpirationDateError('');
            setOpenSnackbar(true);
            setSnackbarMessage("Passwords do not match.");
            setSnackbarType('error');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5005/user/auth/customer_register', {
                Name: registerData.Name,
                email: registerData.email,
                password: registerData.password,
                cardNumber: registerData.cardNumber,
                cardCVC: registerData.cardCVC,
                cardExpirationDate: registerData.cardExpirationDate,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 201) {
                setSnackbarMessage("Registration successful!");
                setSnackbarType('success');
                setOpenSnackbar(true);
                setTimeout(() => navigate('/combined-login?role=customer'), 500);
            }
        } catch (errorResponse) {
            const errorMessage = errorResponse.response?.data?.message || 'An unexpected error occurred during registration.';
            setOpenSnackbar(true);
            setSnackbarMessage(errorMessage);
            setSnackbarType('error');
        }
    };

    const action = (
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
        </IconButton>
    );
    
    return (

        <>
                 <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                     onClose={handleCloseSnackbar}
                     message={snackbarMessage}
                     anchorOrigin={{ vertical: 'bottom', horizontal: 'center',}}
                     ContentProps={{
                        style: {
                            backgroundColor: snackbarType === 'success' ? theme.palette.success.main : theme.palette.error.main,
                        },
                    }}
                    action={action}
                />

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
            {/* Content and styling similar to the provided structure */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
                <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Join Our Amazing Ticket Platform
                </Typography>
            </Box>
            <Box component="form" onSubmit={registerUser} noValidate sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 600, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: theme.spacing(4), borderRadius: theme.shape.borderRadius }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Create Your Customer Account
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="Name"
                    label="Name"
                    name="Name"
                    autoComplete="name"
                    autoFocus
                    value={registerData.Name}
                    onChange={updateField}

                    error={registerData.Name && (registerData.Name.length < 3 || registerData.Name.length > 100 || /\s/.test(registerData.Name))}
                    helperText={registerData.Name
                        ? (/\s/.test(registerData.Name)
                        ? 'Name cannot include spaces.'
                        :
                            registerData.Name.length < 3
                            ? 'Name must be at least 3 characters long.'
                            : registerData.Name.length > 100
                                ? 'Name cannot be more than 100 characters long.'
                                : '')
                        : ' '} />
                <TextField
                    error={!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerData.email) && registerData.email !== ''}
                    helperText={!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerData.email) && registerData.email !== '' ? 'Enter a valid email address.' : ' '}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={registerData.email}
                    onChange={updateField} />
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
                {/* Assuming card details are needed for host registration */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="cardNumber"
                    label="Card Number"
                    value={registerData.cardNumber}
                    onChange={updateField}
                    inputProps={{ maxLength: 16 }}
                    error={registerData.cardNumber && !/^[\d]{16}$/.test(registerData.cardNumber)}
                    helperText={registerData.cardNumber && !/^[\d]{16}$/.test(registerData.cardNumber) ? 'Card number must be 16 digits.' : ' '} />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="cardCVC"
                    label="CVC"
                    value={registerData.cardCVC}
                    onChange={updateField}
                    inputProps={{ maxLength: 3 }}
                    error={registerData.cardCVC && !/^\d{3}$/.test(registerData.cardCVC)}
                    helperText={registerData.cardCVC && !/^\d{3}$/.test(registerData.cardCVC) ? 'CVC must be 3 digits.' : ' '} />
                <TextField
                         margin="normal"
                         required    
                         fullWidth
                         name="cardExpirationDate"
                         label="Expiration Date (MM/YY)"
                         value={registerData.cardExpirationDate}
                         onChange={handleExpirationDateChange}
                         inputProps={{ maxLength: 5 }}
                         error={!!expirationDateError} // Error state derived from expirationDateError
                         helperText={expirationDateError} // Display the error message from expirationDateError
                    />
                
                
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
                >
                    Register
                </Button>
                <Button
                    fullWidth
                    variant="text"
                    onClick={() => navigate('/combined-login?role=customer')}
                >
                    Already have an account? Login
                </Button>
            </Box>
        </Box>           
    </>
    );

};

export default RegisterCustomer;