import React from 'react';
import { Button } from '@mui/material';

const Login = () => {
    const handleLoginClick = () => {
        console.log('Login clicked');
        window.location.href = '/register-customer'; // 触发跳转到我的事件的页面
    };

    return (
        <Button 
            color="secondary" 
            variant="contained" 
            sx={{ mr: 80 }} 
            onClick={handleLoginClick} // 绑定处理函数到按钮的点击事件
        >
            Login
        </Button>
    );
};

export default Login;