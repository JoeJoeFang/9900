import React from 'react';
import { Button } from '@mui/material';

const HostedEvents = () => {
    const handleHostedEventsClick = () => {
        console.log('Hosted events clicked');
        window.location.href = '/my-hosted-event'; 
    };

    return (
        <Button 
            color="info" // 注意：Mui Button 默认不提供 'success' 颜色，需要在主题中自定义或选择其他颜色
            variant="contained" 
            sx={{ mr: 1 ,fontWeight: 'bold',}} 
            onClick={handleHostedEventsClick} 
            // 绑定处理函数到按钮的点击事件
        >
            Hosted Event
        </Button>
    );
};

export default HostedEvents;
