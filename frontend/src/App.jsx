//wenyima
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageList from './PageList';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
    <>
      <Router>
        <PageList />
      </Router>
    </>
  );
}

export default App;
