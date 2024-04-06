import React from 'react';
import { Button } from '@mui/material';

const HostProfile = () => {
    const handleHostProfileClick = () => {
        console.log('Host Profile clicked');
        window.location.href = '/host-profile'; // 触发跳转到主办方资料的页面
    };

    return (
        <Button 
            color="info" // 注意：Mui Button 默认不提供 'success' 颜色，需要在主题中自定义或选择其他颜色
            variant="contained" 
            sx={{ mr: 1 ,fontWeight: 'bold',}} 
            onClick={handleHostProfileClick} // 绑定处理函数到按钮的点击事件
        >
            Host Profile
        </Button>
    );
};

export default HostProfile;

