//sijia han
import React from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase } from '@mui/material';
import { styled } from '@mui/system';
import { getToken, removeUserSession } from '../utils/Auth';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '4px',
  backgroundColor: '#fff',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: '8px 8px 8px 32px',
    width: '100%',
  },
});

function Header() {
  let navigate = useNavigate();

  const handleLogout = () => {
    removeUserSession();
    navigate('/');
  };

  const token = getToken();

  return (
    <AppBar position="static" sx={{ background: '#FF6F61' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Our Amazing Ticket Platform
        </Typography>
        <Search>
          <SearchIcon sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, margin: 'auto', height: '100%', paddingLeft: '16px' }} />
          <StyledInputBase placeholder="Search…" />
        </Search>
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>
        {token && (
          <>
            <Button component={Link} to="/all-events" color="inherit">
              All Events
            </Button>
            <Button component={Link} to="/my-events" color="inherit">
              My Events
            </Button>
            <Button component={Link} to="/account" color="inherit">
              Account
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          </>
        )}
        {!token && (
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
