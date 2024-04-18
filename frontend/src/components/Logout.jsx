import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, ThemeProvider, useTheme } from '@mui/material';
import LogoutIcon from '@mui/icons-material/ExitToApp';

const Logout = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const logout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('identity');
    window.location.href = '/';
  };

  return (
      <ThemeProvider theme={theme}>
        <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              if (newValue === 0) {  // 当选中第一个选项时执行登出
                logout();
              }
            }}
            sx={{ width: '100%', position: 'fixed', top: 0, color: "#546e7a" }}
        >
          <BottomNavigationAction label="Logout" icon={<LogoutIcon />} />
        </BottomNavigation>
      </ThemeProvider>
  );
};

export default Logout;
