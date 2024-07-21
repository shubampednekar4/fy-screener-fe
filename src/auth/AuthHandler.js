import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notification } from 'antd';
const AuthHandler = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get('auth_code');
    const code = queryParams.get('code');

    if (code === '200' && authCode) {
      axios.post(process.env.REACT_APP_BASE_URL+'api/auth/validate-authcode', {
        auth_code: authCode
      })
      .then(response => {
        if (response.status === 200) {
         // Show success notification and redirect
         notification.success({
            message: 'Login Successful',
            description: 'You have been successfully logged in.',
            placement: 'topRight'
          });
        navigate('/')}
        }) // Replace '/dashboard' with the actual route to your dashboard
        .catch(error => {
            if (error.response && error.response.status === 401) {
              // Redirect to login page if authentication is needed
              navigate('/login');
            }
      });
    } else {
        notification.error({
            message: 'Error',
            description: 'There was an error processing your request. Please try again.',
            placement: 'topRight'
          });
    }
  }, [location]);

  return null; // Or a message to indicate processing
};

export default AuthHandler;
