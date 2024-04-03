import React, { useState } from 'react';
import { Box,TextField, IconButton, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import { NativeSelect } from '@mui/material';
const SearchEvents = (props) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [error, setError] = useState('');
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  // 假设的静态选项数据，这里仅以事件类型为例
  const eventTypes = [
    { id: 'None', title: 'All Types' }, 
    { id: 'concert', title: 'Concert' },
    { id: 'conference', title: 'Conference' },
    { id: 'meeting', title: 'Meeting' },
    { id: 'webinar', title: 'Webinar' },
    // 添加更多类型...
  ];
  
  const handleSearch = async () => {
    const keyword = `${searchTitle} ${searchDescription} `.trim();
  
    try {
      const response = await axios.get('http://localhost:5005/events/search', {
        params: { // 使用params属性来传递查询参数
          keyWord: keyword, 
          eventType: eventType === 'None' ? null : eventType,// 确保这个参数名称与你后端期望的一致
        },
      });
      const data = response.data; // 这是事件列表
      props.searchCallback(data)
      setEvents(data); // 更新状态以存储事件数据
      setSnackbarOpen(data.length === 0); 
      setErrorMessage('No events found.');// 如果没有搜索到事件，显示Snackbar
    } catch (error) {
      console.error("There was an error fetching the events:", error);
      setError("Failed to load events. Please try again later.");
      setSnackbarOpen(true); // 出现错误时显示Snackbar
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <div>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar }message={errorMessage}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <TextField
        label="Title"
        variant="outlined"
        size="small"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
      />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel htmlFor="event-type-selector">Event Type</InputLabel>
            <NativeSelect
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                inputProps={{
                  name: 'event-type',
                  id: 'event-type-selector',
                }}
            >
              {eventTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.title}</option>
              ))}
            </NativeSelect>
          </FormControl>
      <TextField
        label="Description"
        variant="outlined"
        size="small"
        value={searchDescription}
        onChange={(e) => setSearchDescription(e.target.value)}
      />
      <IconButton onClick={handleSearch} size="large">
        <SearchIcon />
      </IconButton>
      </Box>
    </div> 
</div>
  );
};

export default SearchEvents;
