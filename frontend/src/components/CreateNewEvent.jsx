import React from 'react';
import { Button } from '@mui/material';

const CreateNewEvent = () => {
    const handleCreateNewEvent = () => { // 更改函数名称以避免与组件名称冲突
        console.log('Create New Event clicked');
        window.location.href = '/create-new-event'; // 触发跳转到创建新事件的页面
    };

    return (
        <Button 
            color="primary" 
            variant="contained" 
            sx={{ mr: 1 }} 
            onClick={handleCreateNewEvent} // 绑定处理函数到按钮的点击事件
        >
            Create New Event
        </Button>
    );
};

export default CreateNewEvent;