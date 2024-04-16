import React, { useState } from 'react';
import axios from 'axios';
import { Box, Paper, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchEvents = (props) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const eventTypes = [
    { id: 'None', title: '' },
    { id: 'all types', title: 'All types' },
    { id: 'concert', title: 'Concert' },
    { id: 'conference', title: 'Conference' },
    { id: 'meeting', title: 'Meeting' },
    { id: 'webinar', title: 'Webinar' },
    // Add more event types as needed...
  ];

  const handleSearch = async () => {
    // 检查eventType，如果是'None'，则不发送这个参数或发送空字符串
    const eventTypeParam = eventType === 'None' ? '' : eventType;
    try {
      console.log('Request parameters:', {
        description: searchDescription,
        keyWord: searchTitle,
        eventType: eventTypeParam,
      });
      
      const response = await axios.get('http://localhost:5005/events/search', {
        params: {
          description: searchDescription, 
          keyWord: searchTitle, 
          eventType: eventTypeParam, 
        },
      });
      
      const data = response.data;
      props.searchCallback(data);
      setSnackbarOpen(data.length === 0);
      setErrorMessage(data.length === 0 ? 'No events found.' : '');
    } catch (error) {
      console.error("There was an error fetching the events:", error);
      setErrorMessage("Failed to load events. Please try again later.");
      setSnackbarOpen(true);
    }
};


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 4, marginTop: '100px', }}>
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      
      <Paper elevation={6} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', borderRadius: '24px', boxShadow: '1', maxWidth: '800px', width: '100%', p: 2, mb: 2, bgcolor: 'background.paper' }}>
        <TextField
          sx={{ m: 1, flexGrow: 1 }}
          label="Title"
          variant="outlined"
          size="small"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
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
        <TextField
          sx={{ m: 1, flexGrow: 2 }}
          label="Description"
          variant="outlined"
          size="small"
          value={searchDescription}
          onChange={(e) => setSearchDescription(e.target.value)}
        />
        <IconButton sx={{ m: 1, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, color: 'white', borderRadius: '50%' }} onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchEvents;
