//wenyima
import React from 'react';
// import { Container, Button, Typography, Box, Stack } from '@mui/material';
import { Button, Typography, Box, Stack, useTheme } from '@mui/material';
import { useNavigate, Route, Routes } from 'react-router-dom';
import HeaderLogo from './components/HeaderLogo';
import { LoginHost, LoginCustomer } from './pages/Login.jsx'
import RegisterHost from './pages/RegisterHost.jsx';
import RegisterCustomer from './pages/RegisterCustomer.jsx';
import CreateNewEvent from "./pages/CreateEvent_version2.jsx";
import AllEventPage from "./pages/AllEvent.jsx";

import './App.css';
import EventDetails from "./pages/EventDetails";
import BookingList from "./pages/MyBookingPage";
import MyHostedEventsPage from "./pages/MyHostedEventsPage";

const DefaultPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const signUpAsHost = () => {
        console.log("Signing up as a Host");
        navigate('/login-host');
    };

    const signUpAsCustomer = () => {
        console.log("Signing up as a Customer");
        navigate('/login-customer');
    };

    const visitorAccess = () => {
        console.log("Accessing as a Visitor");
        navigate('/all-event')
        // 实现跳转逻辑，例如：navigate('/visitor-access');
    };


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
            <HeaderLogo theme={theme} />

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
                <Route path='/login-customer' element={<LoginCustomer token={token} />} />
                <Route path='/register-host' element={<RegisterHost />} />
                <Route path='/register-customer' element={<RegisterCustomer />} />
                <Route path='/all-event' element={<AllEventPage />} />
                {/*<Route path='/my-account' element={<MyAccount />} />
                {/*<Route path='/my-hosted-list' element={<HostedListsScreen />} />*/}
                <Route path='/create-new-event' element={<CreateNewEvent />} />
                <Route path='/all-event/:eventId' element={<EventDetails />} />
                <Route path='/my-booking' element={<BookingList />} />
                <Route path='/my-hosted-event' element={<MyHostedEventsPage />} />

                {/*<Route path='/view-listings/:listingId' element={<ViewListingPage />} />*/}
                {/*<Route path='/edit-listing/:listingId' element={<EditListingPage />} />*/}
                {/*<Route path='/my-hosted-list/publish/:listingId' element={<ListingPublishScreen />} />*/}
                {/*<Route path='/my-hosted-list/booking-request/:listingId' element={<BookingRequestPage />} />*/}
            </Routes>
        </>
    );
};

export default PageList;