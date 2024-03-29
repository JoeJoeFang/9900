import React from 'react';
import { Button } from '@mui/material';

const MyAccount = () => {
    const handleMyAccountClick = () => {
        console.log('My Account clicked');
        window.location.href = '/my-account'; // 触发跳转到我的事件的页面
    };

    return (
        <Button 
            color="secondary" 
            variant="contained" 
            sx={{ mr: 1 }} 
            onClick={handleMyAccountClick} // 绑定处理函数到按钮的点击事件
        >
            My Account
        </Button>
    );
};

export default MyAccount;
