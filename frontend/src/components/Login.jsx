import React from 'react';
import { Button } from '@mui/material';

const Login = () => {
    const handleLoginClick = () => {
        console.log('Login clicked');
        window.location.href = '/combined-login'; // 触发跳转到我的事件的页面
    };

    return (
        <Button 
            color="info" 
            variant="contained" 
            sx={{ mr: 1 ,fontWeight: 'bold', }} 
            onClick={handleLoginClick} // 绑定处理函数到按钮的点击事件
        >
            Login To Explore More
        </Button>
    );
};

export default Login;