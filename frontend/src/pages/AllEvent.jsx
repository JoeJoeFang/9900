// import {Box, Button, IconButton, TextField, Typography} from "@mui/material";
import {Box, Typography, useTheme} from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";


const AllEventPage = () => {
    console.log("landing all event page");
    const theme = useTheme();

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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
                <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Our Amazing Ticket Platform
                </Typography>
            </Box>
        </Box>
    );
};

export default AllEventPage;