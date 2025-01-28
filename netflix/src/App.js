import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoPage from './pages/VideoPage';
import AdminPage from './pages/AdminPage';
import MovieInformation from './pages/MovieInformation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="movies/:id/watch" element={<VideoPage />} />
        <Route path="managementPanel" element={<AdminPage />} />
        <Route path="movies/:id/info" element={<MovieInformation />} />

      </Routes>
    </Router>
  );
}

export default App;

