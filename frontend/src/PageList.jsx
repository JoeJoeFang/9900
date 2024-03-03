import React from 'react';
// import { Container, Button, Typography, Box, Stack } from '@mui/material';
import { Button, Typography, Box, Stack } from '@mui/material';
// import { useNavigate, Route, Routes } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import './App.css'; // 确保你的CSS文件中包含背景图片的样式

const DefaultPage = () => {
    // const navigate = useNavigate();

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
//         <Container maxWidth="sm" sx={{
//             minHeight: '100vh',
//             minWidth: '100vh',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             background: `url(/default_background.jpg), #e6a3a3`,
//             backgroundSize: 'cover, cover',
//             backgroundPosition: 'center, center'
//         }}>
//
//         <Box textAlign="center" color="white" paddingTop={5} paddingBottom={5}>
//                 <Typography variant="h2" gutterBottom>
//                     Our Amazing Ticket Platform
//                 </Typography>
//                 <Typography variant="subtitle1" gutterBottom>
//                     The best way to book an event and know all about
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                     Start your booking with us and join our community!
//                 </Typography>
//                 <Button variant="contained" color="primary" onClick={signUpAsHost} style={{margin: 8}}>
//                     To be a Host!
//                 </Button>
//                 <Button variant="contained" color="secondary" onClick={signUpAsCustomer} style={{margin: 8}}>
//                     To be a Customer!
//                 </Button>
//                 <Button variant="outlined" onClick={visitorAccess} style={{margin: 8}}>
//                     Visitor Access Mode
//                 </Button>
//             </Box>
//         </Container>
//     );
// }
//     return (
//         <Container maxWidth="sm" sx={{
//             minHeight: '100vh', // 使容器高度充满整个视口
//             display: 'flex', // 使用Flexbox布局
//             flexDirection: 'column', // 子项垂直排列
//             justifyContent: 'center', // 垂直居中
//             alignItems: 'center', // 水平居中
//             background: `url(/default_background.jpg), #e6a3a3`,
//             backgroundSize: 'cover, cover',
//             backgroundPosition: 'center, center'
//         }}>
//             <Box textAlign="center" color="white" p={5} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
//                 <Typography variant="h2" gutterBottom>
//                     Our Amazing Ticket Platform
//                 </Typography>
//                 <Typography variant="subtitle1" gutterBottom>
//                     The best way to book an event and know all about
//                 </Typography>
//                 <Typography variant="body1" gutterBottom>
//                     Start your booking with us and join our community!
//                 </Typography>
//                 <Stack direction="column" spacing={2}>
//                     <Button variant="contained" color="primary" onClick={signUpAsHost}>
//                         To be a Host!
//                     </Button>
//                     <Button variant="contained" color="secondary" onClick={signUpAsCustomer}>
//                         To be a Customer!
//                     </Button>
//                     <Button variant="outlined" onClick={visitorAccess}>
//                         Visitor Access Mode
//                     </Button>
//                 </Stack>
//             </Box>
//         </Container>
//     );
// };
    return (
        <Box sx={{
            minHeight: '100vh', // 使容器高度充满整个视口
            width: '100%', // 新增：确保宽度也充满整个屏幕
            display: 'flex', // 使用Flexbox布局
            flexDirection: 'column', // 子项垂直排列
            justifyContent: 'center', // 垂直居中
            alignItems: 'center', // 水平居中
            background: `url(/default_background.jpg), #e6a3a3`,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            p: 2, // 新增：为整个Box添加一些内边距
        }}>
            <Box textAlign="center" color="white" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px', width: '100%', maxWidth: '600px' }}> {/* 调整Box宽度以适应内容 */}
                <Typography variant="h2" gutterBottom>
                    Our Amazing Ticket Platform
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    The best way to book an event and know all about
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Start your booking with us and join our community!
                </Typography>
                <Stack direction="column" spacing={2}>
                    <Button variant="contained" color="primary" onClick={signUpAsHost}>
                        To be a Host!
                    </Button>
                    <Button variant="contained" color="secondary" onClick={signUpAsCustomer}>
                        To be a Customer!
                    </Button>
                    <Button variant="outlined" onClick={visitorAccess}>
                        Visitor Access Mode
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};


// export default DefaultPage;

const PageList = () => {
    // const token = localStorage.getItem('token');

    return (
        <>
            <Routes>
                <Route path='/' element={<DefaultPage />} />
                {/*<Route path='/login-host' element={<LoginHost token={token} />} />*/}
                {/*<Route path='/landing-page' element={<LandingPage />} />*/}
                {/*<Route path='/register' element={<RegisterPage />} />*/}
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