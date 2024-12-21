import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useLoginMutation } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../slices/authSlice'; // Import loginSuccess action

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate(); // Use useNavigate hook for navigation
  const dispatch = useDispatch(); // Get dispatch function

  const handleLogin = async (values) => {
    try {
      const data = await login(values).unwrap();
      message.success('Login successful!');
      console.log(data); // Debugging the response
  
      // Dispatch loginSuccess to store tokens and user data in Redux
      dispatch(loginSuccess({
        accessToken: data.access, // Use the access token from the response
        refreshToken: data.refresh, // Use the refresh token from the response
        user: data.user, // Ensure the user is also returned or handle accordingly
      }));
  
      navigate('/'); // Navigate after successful login
    } catch (error) {
      message.error(error.data?.detail || 'Login failed!');
    }
  };
  
  return (
    <Form onFinish={handleLogin} layout="vertical">
      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        Login
      </Button>
    </Form>
  );
};

export default Login;
