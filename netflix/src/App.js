import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoPage from './pages/VideoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="movies/:id/watch" element={<VideoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
