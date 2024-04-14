import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, IconButton, useTheme, Tooltip } from '@mui/material';

const BackButton = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <ThemeProvider theme={theme}>
            <Tooltip title="Go back" enterDelay={500} leaveDelay={200}>
                <IconButton
                    onClick={handleBack}
                    size="large"
                    sx={{
                        position: 'fixed',
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
                    {/*<ArrowBackIcon sx={{ fontSize: 28 }} />*/}
                    <img src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} alt="Logo" style={{ width: 80, height: 'auto' }} />
                </IconButton>
            </Tooltip>
        </ThemeProvider>
    );
};

export default BackButton;
