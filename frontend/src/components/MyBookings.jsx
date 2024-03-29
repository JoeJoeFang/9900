import React from 'react';
import { Button } from '@mui/material';

const MyBookings = () => {
    const handleMyEventsClick = () => {
        console.log('My Events clicked');
        window.location.href = '/my-booking'; // 触发跳转到我的事件的页面
    };

    return (
        <Button 
            color="info" 
            variant="contained" 
            sx={{ mr: 1 }} 
            onClick={handleMyEventsClick} // 绑定处理函数到按钮的点击事件
        >
            My Bookings
        </Button>
    );
};

export default MyBookings;
