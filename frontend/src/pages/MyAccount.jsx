import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    ThemeProvider,
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Avatar,
    useTheme
} from '@mui/material';
import Navbar from '../components/Navbar';


const MyAccount = () => {
    const theme = useTheme();
    const [custDetail, setCustDetail] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [rechargeAmount, setRechargeAmount] = useState('');
;

    const fetchCustomerDetails = async () => {
        setIsLoading(true);
        const userId = localStorage.getItem('userId'); // Fetch the 'userId' from localStorage

        if (!userId) {
            setError('User ID is not available');
            setIsLoading(false);
            return; // Exit early if no userId is found
        }

        try {
            const response = await axios.get(`http://localhost:5005/user/auth/customer?userId=${userId}`);
            if (response.data) {
                setCustDetail(response.data);
                setError(null); // Ensure to clear any previous errors
                console.log("response", response);
                console.log("CustDetail", custDetail);
            } else {
                throw new Error('No data returned'); // Handle case where no data is returned
            }
        } catch (error) {
            console.error('There was an error fetching the customer details:', error);
            setError(error.response?.data?.error || 'Unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecharge = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.put('http://localhost:5005/user/auth/customer/recharge', {
                userId: userId,
                amount:rechargeAmount,
            });
            if (response.status === 200 || response.status === 201) {
                setCustDetail(response.data);
                setRechargeAmount('');
                await fetchCustomerDetails();
            }
            

        } catch (error) {
            console.error('recharge failed:', error);
        }
    };
    useEffect(() => {

      
        fetchCustomerDetails().then(r => console.log("fetch customer details successfully"));
      }, []);
      

       // Dependency array left empty to run once on component mount
      
    
    return (
        <ThemeProvider theme={theme}>  
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
            <Box sx={{ position: 'absolute', top: 10, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}></Box>
            <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex',alignItems:'center' }}>
                <Navbar></Navbar>
            </Box>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
                {/*<HeaderLogo theme={theme} />*/}
                {isLoading ? (
                    <CircularProgress color="secondary" style={{ marginTop: '20px' }} />
                ) : error ? (
                    <Typography color="error" style={{ marginTop: '20px' }}>{error}</Typography>
                ) : (
                    <Card sx={{ maxWidth: 345, mt: 5, boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    sx={{ width: 100, height: 100, mb: 2 }}
                                    src={custDetail.avatar || "https://pic2.zhimg.com/80/v2-e6caae14bcb1ef3901b3d8af41752501_1440w.webp"} // Use custDetail.avatar if available
                                    alt="User Avatar"
                                />
                                <Typography gutterBottom variant="h5" component="div">
                                    {custDetail.name || 'Name Unavailable'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" style={{ textAlign: 'center' }}>
                                    UserID: {custDetail.id || 'ID Unavailable'}<br />
                                    Email: {custDetail.email || 'Email Unavailable'}<br />
                                    Due Date: {custDetail.duedate || 'Due Date Unavailable'}<br />
                                    Wallet Balance: ${custDetail.wallet ? custDetail.wallet.toFixed(2) : '0'}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <TextField
                                        label="Recharge Amount"
                                        variant="outlined"
                                        type="number"
                                        value={rechargeAmount}
                                        onChange={(e) => setRechargeAmount(e.target.value)}
                                        size="small"
                                        style={{ marginRight: '10px' }}
                                    />
                                    <Button variant="contained" color="primary" onClick={handleRecharge}>
                                        Recharge
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </div>
        </Box>
        </ThemeProvider>
    );
};

export default MyAccount;
