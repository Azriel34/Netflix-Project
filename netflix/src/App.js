import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoPage from './pages/VideoPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="movies/:id/watch" element={<VideoPage />} />
        <Route path="managementPanel" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;

