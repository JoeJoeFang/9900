import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchEvents = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 2 }}>
      <TextField
        label="Search Events"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        sx={{ width: 'auto' }}
      />
      <IconButton onClick={handleSearch} size="large">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchEvents;
