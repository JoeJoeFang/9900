import React from 'react';
import { Button } from '@mui/material';

const AllEvents = () => {
    const handleAllEventsClick = () => {
        console.log('All events clicked');
        window.location.href = '/all-event'; // 触发跳转到我的事件的页面
    };

    return (
        <Button 
            color="inherit" 
           
            variant="contained" 
            sx={{ mr: 1  ,fontWeight: 'bold',}} 
            onClick={handleAllEventsClick} // 绑定处理函数到按钮的点击事件
        >
            All events
        </Button>
    );
};

export default AllEvents;