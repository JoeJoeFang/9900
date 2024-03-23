import React from 'react';
import { Button, useTheme, ThemeProvider, createTheme } from '@mui/material';

const CreateNewEvent = () => {
    const theme = useTheme(); // 获取主题

    // 定制一个更柔和的按钮颜色
    const buttonColor = theme.palette.grey[300]; // 灰色系列中较浅的颜色
    const textColor = theme.palette.getContrastText(buttonColor); // 获取与背景色对比度高的文字颜色

    const handleCreateNewEvent = () => {
        console.log('Create New Event clicked');
        window.location.href = '/create-new-event';
    };

    return (
        <Button 
            style={{
                backgroundColor: buttonColor,
                color: textColor,
                fontWeight: 'bold',
            }}
            sx={{ 
                mr: 1,
                ':hover': {
                    boxShadow: `0 0 8px ${theme.palette.grey[400]}`, // 鼠标悬停时的阴影颜色更柔和
                    backgroundColor: theme.palette.grey[400], // 悬停时的背景颜色稍深
                },
                padding: theme.spacing(1, 4),
            }} 
            onClick={handleCreateNewEvent}
        >
            Create New Event
        </Button>
    );
};

// 使用ThemeProvider确保主题可用
const theme = createTheme({
    palette: {
        // 根据需要自定义主题颜色
    },
});

const App = () => (
    <ThemeProvider theme={theme}>
        <CreateNewEvent />
    </ThemeProvider>
);

export default App;
