import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField,Typography, CircularProgress, Card, CardContent, Avatar, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import SearchEvents from '../components/SearchEvents'; // Ensure this is the correct path
import Navbar from '../components/Navbar';
import HeaderLogo from '../components/HeaderLogo';

const theme = createTheme({
    palette: {
        primary: {
            main: '#e66465',
        },
        secondary: {
            main: '#9198e5',
        },
    },
});

const MyAccount = () => {
    const [custDetail, setCustDetail] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [rechargeAmount, setRechargeAmount] = useState('');

    const handleSearch = (searchTerm) => {
        console.log("Search term:", searchTerm);
    };
    const handleRecharge = async () => {
        // 实际操作中应当检查 rechargeAmount 是否为有效数值
        try {
            const response = await axios.put('http://localhost:5005/user/auth/customer/recharge', {
                userId:custDetail.id,
                amount:rechargeAmount,
            });
            
            // 假设API返回了更新后的用户详情，包括新的钱包余额
            setCustDetail(response.data);
            setRechargeAmount(''); // 清空输入框
        } catch (error) {
            console.error('充值失败:', error);
            // 根据需要处理错误
        }
    };
    useEffect(() => {
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
      
        fetchCustomerDetails();
      }, []); 
      

       // Dependency array left empty to run once on component mount
      
    
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
            <Box sx={{ position: 'absolute', top: 10, display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}></Box>
            <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex' }}>
                <SearchEvents onSearch={handleSearch} />
                {/* <CreateNewEvent /> */}
                {/* <MyBookings /> */}
                {/* <HostProfile /> */}
                {/* <Logout /> */}
                <Navbar></Navbar>
            </Box>
            <HeaderLogo theme={theme} />
                {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Card sx={{ maxWidth: 345, mt: 5 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar
                                    sx={{ width: 100, height: 100, mb: 2 }}
                                    src="https://pic2.zhimg.com/80/v2-e6caae14bcb1ef3901b3d8af41752501_1440w.webp" // Replace with userDetails.avatar if available
                                    alt="User Avatar"
                                />
                                <Typography gutterBottom variant="h5" component="div">
                {custDetail.name || 'Name not available'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                UserID: {custDetail.id || 'ID not available'}<br />
                Email: {custDetail.email || 'Email not available'}<br />
                Due Date: {custDetail.duedate || 'Due date not available'}<br />
                Wallet Balance: ${custDetail.wallet ? custDetail.wallet.toFixed(2) : 'Balance not available'}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                <TextField
                                    label="充值金额"
                                    variant="outlined"
                                    type="number"
                                    value={rechargeAmount}
                                    onChange={(e) => setRechargeAmount(e.target.value)}
                                    size="small"
                                />
                                <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleRecharge}>
                                    充值
                                </Button>
                            </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Box>
       
    );
};

export default MyAccount;
