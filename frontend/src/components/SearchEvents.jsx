import React, { useState } from 'react';
import { Box, TextField, IconButton, FormControl, Select, MenuItem, InputLabel, Snackbar, Alert, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


const SearchEvents = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [error, setError] = useState('');
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [events, setEvents] = useState([]); // 新增状态来存储搜索结果

  
  // 假设的静态选项数据
  const eventTypes = [
    { id: 'None', title: 'All Types' }, 
    { id: 1, title: 'concert' },
    { id: 2, title: 'conference' },
    { id: 3, title: 'Meeting' },
    { id: 4, title: 'Webinar'},
    // 添加更多类型...
  ];

  const sortOptions = [
    { value: 'None', label: 'Select Sort' },
    { value: '1', label: 'Most Viewed' },
    { value: '2', label: 'Upcoming Events' },
    { value: '3', label: 'Ongoing Events' },
    { value: '4', label: 'Price Ascending' },
    { value: '5', label: 'Price Descending' },
    { value: '6', label: 'Latest Event' },
    // 添加更多排序选项...
  ];

  const handleSearch = async () => {
    const params = new URLSearchParams({
      keyword: searchTerm.trim(),
      type: eventType,
      sort: sortOrder,
      page: 1
    }).toString();

    try {
      const response = await fetch(`http://127.0.0.1:5005/user/search?${params}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Non-JSON response received');
      }

      const data = await response.json();
      setEvents(data.events); 
      if (data.events.length === 0) {
        setError('No related events found. Please try again with different search criteria.');
        setSnackbarOpen(true);// 使用后端返回的数据更新状态
      onSearch(data); // 假设你会在父组件中进一步处理这个数据
    } }
    catch (error) {
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

      {/* 在这里渲染搜索结果 */}
      {events.map((event) => (
        <Box key={event.id} sx={{ mt: 2 }}>
          <Typography variant="h6">{event.title}</Typography>
          <Typography variant="body2">{event.description}</Typography>
          {/* 根据需要添加更多细节 */}
        </Box>
      ))}
    </Box>
  );
};

export default SearchEvents;
