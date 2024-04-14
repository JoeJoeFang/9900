//wenyima
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import RegisterHost from './pages/RegisterHost.jsx';
import RegisterCustomer from './pages/RegisterCustomer.jsx';
import CreateNewEvent from "./pages/CreateEventPage.jsx";
import AllEventPage from "./pages/AllEvent.jsx";

import './App.css';
import EventDetails from "./pages/EventDetails";
import BookingList from "./pages/MyBookingPage";
import MyHostedEventsPage from "./pages/MyHostedEventsPage";
import MyAccount from "./pages/MyAccount";
import CombinedLogin from "./pages/NewLoginPage";
import { ForgotPassword } from './pages/ForgetPassword.jsx';



const PageList = () => {
    const token = localStorage.getItem('token');

    return (
        <>
            <Routes>
                <Route path='/' element={<AllEventPage />} />
                {/*<Route path='/login-host' element={<LoginHost token={token} />} />*/}
                {/*<Route path='/login-customer' element={<LoginCustomer token={token} />} />*/}
                <Route path='/register-host' element={<RegisterHost />} />
                <Route path='/register-customer' element={<RegisterCustomer />} />
                <Route path='/all-event' element={<AllEventPage />} />
                <Route path='/my-account' element={<MyAccount  token={token}/>} />
                {/*<Route path='/my-hosted-list' element={<HostedListsScreen />} />*/}
                <Route path='/create-new-event' element={<CreateNewEvent />} />
                <Route path='/all-event/:eventId' element={<EventDetails />} />
                <Route path='/my-booking' element={<BookingList />} />
                <Route path='/my-hosted-event' element={<MyHostedEventsPage />} />
                <Route path='/combined-login' element={<CombinedLogin />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
            </Routes>
        </>
    );
};

export default PageList;