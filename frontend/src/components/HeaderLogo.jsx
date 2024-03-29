import React from 'react';
import { Box, Typography } from '@mui/material';

const HeaderLogo = ({ theme }) => {
    return (
        <Box sx={{
            display: 'flex', // 使用flex布局使元素水平排列
            alignItems: 'center', // 垂直居中对齐图标和文本
            justifyContent: 'center', // 水平居中整个Box
            width: '100%',
            mb: theme.spacing(8), // 底部外边距
            gap: theme.spacing(2), // 在商标和名称之间添加一些间隔
            color: 'rgba(255, 255, 255, 0.7)', // 调整整个Box中文本的颜色和透明度
            '& img': {
                opacity: 0.7, // 调整图标的透明度
            }
        }}>
            <img src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} alt="Logo" style={{ width: 80, height: 'auto' }} />
            <Typography variant="h3" color="white" sx={{ fontWeight: 'bold' }}>
                Our Amazing Ticket Platform
            </Typography>
        </Box>
    );
};

export default HeaderLogo;
