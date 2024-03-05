//wenyima
import React from 'react';
// import { Container, Button, Typography, Box, Stack } from '@mui/material';
import { Button, Typography, Box, Stack, useTheme } from '@mui/material';
// import { useNavigate, Route, Routes } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import LoginHost from './pages/Login.jsx'
import RegisterPage from './pages/Register.jsx'

import './App.css';

const DefaultPage = () => {
    // const navigate = useNavigate();
    const theme = useTheme();

    const signUpAsHost = () => {
        console.log("Signing up as a Host");
        // 实现跳转逻辑，例如：navigate('/host-signup');
    };

    const signUpAsCustomer = () => {
        console.log("Signing up as a Customer");
        // 实现跳转逻辑，例如：navigate('/customer-signup');
    };

    const visitorAccess = () => {
        console.log("Accessing as a Visitor");
        // 实现跳转逻辑，例如：navigate('/visitor-access');
    };


//     return (
//         <Box sx={{
//             minHeight: '100vh',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center', // 确保内容垂直居中
//             alignItems: 'center',
//             background: `url(${process.env.PUBLIC_URL}/default_background.jpg), #e6a3a3`,
//             backgroundSize: 'cover, cover',
//             backgroundPosition: 'center, center',
//             p: 2,
//         }}>
//             {/* 商标图片 */}
//             <Typography variant="h2" color="white" sx={{ marginTop: 2, alignSelf: 'flex-start' }}>
//                  <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 120, height: 'auto', marginTop: 2 }} />Our Amazing Ticket Platform
//             </Typography>
//
//             <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', mt: 2 }}>
//                 {/* 标语 */}
//                 <Box sx={{ color: 'white', maxWidth: '50%' }}>
//                     {/* 标语 */}
//                     <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, color: 'text.primary', fontWeight: 'medium' }}>
//                         The best way to book an event and know all about
//                     </Typography>
//                     <Typography variant="body1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
//                         Start your booking with us and join our community!
//                     </Typography>
//                 </Box>
//             {/* 包裹按钮的容器 */}
//
//                 <Box sx={{
//                     display: 'flex',
//                     flexDirection: 'column', // 将方向改为垂直
//                     alignItems: 'center', // 确保水平居中
//                     width: '80%', // 调整宽度为视口宽度的80%
//                     maxWidth: 600, // 最大宽度限制
//                     mt: 2,
//                     backgroundColor: 'rgba(255, 255, 255, 0.7)', // 调整背景色的透明度
//                     borderRadius: '8px',
//                     p: 4, // 增加内边距
//                 }}>
//                     {/* Sign Up 标语 */}
//                     <Typography variant="h4" component="div" sx={{ mb: 3, fontWeight: 'bold' }}>
//                         Sign Up & Start Your Free Trial
//                     </Typography>
//
//                     {/* 按钮 */}
//                     <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
//                         <Button variant="contained" color="primary" onClick={signUpAsHost} sx={{ py: 1.5, fontSize: '1rem' }}>
//                             To be a Host!
//                         </Button>
//                         <Button variant="contained" color="secondary" onClick={signUpAsCustomer} sx={{ py: 1.5, fontSize: '1rem' }}>
//                             To be a Customer!
//                         </Button>
//                         <Button variant="outlined" onClick={visitorAccess} sx={{ py: 1.5, fontSize: '1rem' }}>
//                             Visitor Access Mode
//                         </Button>
//                     </Stack>
//                 </Box>
//             </Box>
//         </Box>
//     );
// };
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: `url(${process.env.PUBLIC_URL}/default_background.jpg), linear-gradient(to right, #e66465, #9198e5)`,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            p: theme.spacing(2),
        }}>
            {/* 商标图片和平台标题 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: theme.spacing(4) }}>
                <Box component="img" src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} sx={{ width: 150, height: 'auto', mb: 2 }} />
                <Typography variant="h3" color="white" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Our Amazing Ticket Platform
                </Typography>
            </Box>

            {/* 内容容器 */}
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%', maxWidth: 1200 }}>
                {/* 标语 */}
                <Box sx={{ color: 'white', width: '40%', p: 3, background: 'rgba(0, 0, 0, 0.5)', borderRadius: theme.shape.borderRadius }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2, color: 'white', fontWeight: 'medium' }}>
                        The best way to book an event and know all about
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 'medium' }}>
                        Start your booking with us and join our community!
                    </Typography>
                </Box>

                {/* 按钮容器 */}
                <Box sx={{
                    width: '40%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: theme.shape.borderRadius,
                    p: theme.spacing(4),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
                        Sign Up & Start Your Free Trial
                    </Typography>

                    <Stack direction="column" spacing={2}>
                        <Button variant="contained" color="primary" onClick={signUpAsHost} sx={{ py: theme.spacing(1.5), px: theme.spacing(3), fontSize: '1.1rem' }}>
                            To be a Host!
                        </Button>
                        <Button variant="contained" color="secondary" onClick={signUpAsCustomer} sx={{ py: theme.spacing(1.5), px: theme.spacing(3), fontSize: '1.1rem' }}>
                            To be a Customer!
                        </Button>
                        <Button variant="outlined" onClick={visitorAccess} sx={{ py: theme.spacing(1.5), px: theme.spacing(3), fontSize: '1.1rem', borderColor: theme.palette.primary.main, color: theme.palette.primary.main }}>
                            Visitor Access Mode
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};


// export default DefaultPage;

const PageList = () => {
    const token = localStorage.getItem('token');

    return (
        <>
            <Routes>
                <Route path='/' element={<DefaultPage />} />
                <Route path='/login-host' element={<LoginHost token={token} />} />
                {<Route path='/Register' element={<RegisterPage />} />}
                {/*<Route path='/landing-page' element={<LandingPage />} />}
                {/*<Route path='/my-hosted-list' element={<HostedListsScreen />} />*/}
                {/*<Route path='/create-new-listing' element={<CreateListingPage />} />*/}
                {/*<Route path='/view-listings/:listingId' element={<ViewListingPage />} />*/}
                {/*<Route path='/edit-listing/:listingId' element={<EditListingPage />} />*/}
                {/*<Route path='/my-hosted-list/publish/:listingId' element={<ListingPublishScreen />} />*/}
                {/*<Route path='/my-hosted-list/booking-request/:listingId' element={<BookingRequestPage />} />*/}
            </Routes>
        </>
    );
};

export default PageList;