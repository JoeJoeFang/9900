import Toolbar from '@mui/material/Toolbar';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {BottomNavigation, BottomNavigationAction, AppBar, IconButton} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import FavoriteIcon from '@mui/icons-material/Favorite';
const Navbar = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const [identity, setIdentity] = useState(localStorage.getItem('identity'));
  const logout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('identity');
    navigate('/', { replace: true });
    window.location.reload();
  };


  const handleLogoClick = () => {
    navigate('/all-event');
  };
  useEffect(() => {
    const handleStorageChange = () => {
      setIdentity(localStorage.getItem('identity'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const navigationItems = {
    'customer': [
      { label: 'Back', icon: <ArrowBackIcon />, path: () => navigate(-1) },
      { label: 'All Events', icon: <HomeIcon />, path: () => navigate('/all-event') },
      { label: 'My Account', icon: <AccountCircleIcon />, path: () => navigate('/my-account') },
      { label: 'My Bookings', icon: <FavoriteIcon />, path: () => navigate('/my-booking') },
      { label: 'Logout', icon: <LogoutIcon />, action: logout },

    ],
    'host': [
      { label: 'Back', icon: <ArrowBackIcon />, path: () => navigate(-1) },
      { label: 'All Events', icon: <HomeIcon />, path: () => navigate('/all-event') },
      { label: 'Hosted Events', icon: <EventIcon />, path: () => navigate('/my-hosted-event') },
      { label: 'Create Event', icon: <AddCircleOutlineIcon />, path: () => navigate('/create-new-event') },
      { label: 'Logout', icon: <LogoutIcon />, action: logout },
    ],
    'visitor': [
      { label: 'Back', icon: <ArrowBackIcon />, path: () => navigate(-1) },
      { label: 'Login To Explore More', icon: <AccountCircleIcon />, path: () => navigate('/combined-login') },
    ]
  };

  const items = navigationItems[identity] || navigationItems['visitor'];

  return (
      <AppBar position="fixed" sx={{ backgroundColor: '#ffffff', color: '#333' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo" onClick={handleLogoClick}>
            <img src={`${process.env.PUBLIC_URL}/LogoImage.jpg`} alt="Logo" style={{ width: 40, height: 'auto' }} />
          </IconButton>
          <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
                const item = items[newValue];
                if (item.path) {
                  item.path();
                } else if (item.action) {
                  item.action();
                }
              }}
              sx={{ width: '100%' }}
          >
            {items.map((item, index) => (
                <BottomNavigationAction key={index} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        </Toolbar>
      </AppBar>
  );
};


export default Navbar;
