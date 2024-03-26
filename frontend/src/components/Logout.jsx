import React from 'react';
import { Button } from '@mui/material';

const Logout = () => {
  const logout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('identity');
    window.location.href = '/'; // 触发跳转到首页或登录页
  };

  return (
    <Button
      onClick={logout}
      color="error" // 使用 error 颜色以突出显示该操作的性质
      variant="contained" // 用实心填充的按钮表示
      sx={{ 
          mr: 1, // 为按钮添加右边距，与其他按钮保持一定间距
          fontWeight: 'bold', // 加粗字体以增加视觉重点
      }}
    >
      Logout
    </Button>
  );
};

export default Logout;
