import React, { useState } from 'react';
import { Box, TextField, IconButton, FormControl, Select, MenuItem, InputLabel, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchEvents = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDuration, setEventDuration] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [error, setError] = useState('');
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  // Define your option arrays here...

  // 假设的静态选项数据
  const eventTypes = [
    { id: 1, title: 'Music' },
    { id: 2, title: 'Art' },
    { id: 3, title: 'Concert' },
    // 添加更多类型...
  ];


  const sortOptions = [
    // Assuming 'None' is a valid option to indicate no specific sorting
    { value: 'None', label: 'Select Sort' },
    { value: '1', label: 'Most Viewed' },
    { value: '2', label: 'Upcoming Events' }, // Events that haven't started yet
    { value: '3', label: 'Ongoing Events' }, // Events that have already started
    { value: '4', label: 'Price Ascending' }, // This might be a typo in your original code; assuming it should be ascending
    { value: '5', label: 'Price Descending' },
    { value: '6', label: 'Latest Event' }, // Assuming '6' is the default or another code for the latest events
];
const handleSearch = async () => {
  const params = new URLSearchParams({
    keyword: searchTerm.trim(),
    type: eventType,
    duration: eventDuration,
    sort: sortOrder,
    page: 1
  }).toString();

  try {
    const response = await fetch(`/user/search?${params}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Non-JSON response received');
    }
    const data = await response.json();
    onSearch(data);
  } catch (error) {
    console.error('Fetch error:', error);
    setError('Failed to load events. Please try again.');
    setSnackbarOpen(true);
  }
};

const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setSnackbarOpen(false);
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
       
       <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <TextField
        label="Search Events"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Event Type</InputLabel>
        <Select
          value={eventType}
          label="Event Type"
          onChange={(e) => setEventType(e.target.value)}
        >
          {eventTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>{type.title}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort</InputLabel>
        <Select
          value={sortOrder}
          label="Sort"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton onClick={handleSearch} size="large">
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchEvents;
