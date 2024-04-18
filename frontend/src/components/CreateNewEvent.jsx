import React, { useState } from 'react';
import {ThemeProvider,  BottomNavigation, BottomNavigationAction, useTheme} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CreateNewEvent = () => {
    const [value, setValue] = useState(0);

    const theme = useTheme();

    const handleCreateNewEvent = () => {
        console.log('Create New Event clicked');
        window.location.href = '/create-new-event';
    };
    return (
        <ThemeProvider theme={theme}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    if (newValue === 0) {
                        handleCreateNewEvent();
                    }
                }}
                sx={{ width: '100%', position: 'fixed', top: 0, right: 0 }}
            >
                <BottomNavigationAction label="Create New Event" icon={<AddCircleOutlineIcon />} />
            </BottomNavigation>
        </ThemeProvider>
    );
};


export default CreateNewEvent;
