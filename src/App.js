import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './auth/Login';
import AuthHandler from './auth/AuthHandler';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth-handler" element={<AuthHandler />} />
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
