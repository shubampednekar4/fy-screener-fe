import React from 'react';
import { Button } from 'antd';
import './Login.css'; // Create this CSS file to handle the centering
import axios from 'axios';
const Login = () => {
  const handleLogin = () => {
    axios.post(process.env.REACT_APP_BASE_URL+'api/auth/login', {
    })
    .then(response => {
    //   console.log('Success:', response.data.url);
      window.location.href = response.data.url;
    })
    .catch(error => {
      console.error('Error:', error);
    });

  };

  return (
    <div className="login-container">
      <Button type="primary" onClick={handleLogin}>
        Login with Fyers
      </Button>
    </div>
  );
};

export default Login;
