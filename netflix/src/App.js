import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoPage from '../src/pages/VideoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/api/movies/:id" element={<VideoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
