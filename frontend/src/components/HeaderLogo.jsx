import React from 'react';
import { Box, Typography } from '@mui/material';

const HeaderLogo = ({ theme }) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            mb: theme.spacing(2),
            gap: theme.spacing(1),
            color: 'rgba(255, 255, 255, 0.7)',
            '& img': {
                opacity: 0.9,
            }
        }}>
            <img src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} alt="Logo" style={{ width: 80, height: 'auto' }} />
            <Typography variant="h4" color="white" sx={{ fontWeight: 'bold' }}>
                Our Amazing Ticket Platform
            </Typography>
        </Box>
    );
};

export default HeaderLogo;
