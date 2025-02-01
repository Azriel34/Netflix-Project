import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import Login from './Login/Login'
import Register from './Register/Register';
import { useState } from "react";
import HomeScreen from "./HomeScreen/HomeScreen";
import CategoriesScreen from "./CategoriesScreen/CategoriesScreen";
import ManagerScreen from "./ManagerScreen/ManagerScreen";
import SearchScreen from "./SearchScreen/SearchScreen";
import MovieDetails from "./MovieDetails/MovieDetails";
import AdminPage from "./pages/AdminPage";
import MovieInformation from './pages/MovieInformation';
import VideoPage from './pages/VideoPage';

function App() {

  // Retrieve dark mode state from localStorage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true'; // Returns true or false based on saved value
  });

  const toggleMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Save the new mode to localStorage
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  return (
    <Router>
      <Routes>
        {/* Default homepage */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
      <div className={`App ${isDarkMode ? 'dark' : ''}`}>
        <Routes>
          <Route path="/home" element={<HomeScreen isDarkMode={isDarkMode} toggleMode={toggleMode} />} />
          <Route path="/categories" element={<CategoriesScreen isDarkMode={isDarkMode} toggleMode={toggleMode} />} />
          <Route path="/manager" element={<AdminPage isDarkMode={isDarkMode} toggleMode={toggleMode} />} />
          <Route path="/search" element={<SearchScreen isDarkMode={isDarkMode} toggleMode={toggleMode} />} />
          <Route path="/movie/:id/info" element={<MovieInformation isDarkMode={isDarkMode} toggleMode={toggleMode} />} /> 
          <Route path="/movie/:id/watch" element={<VideoPage isDarkMode={isDarkMode} toggleMode={toggleMode} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

