import React from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { useLoginMutation } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../slices/authSlice'; // Import loginSuccess action

const { Link } = Typography; // Destructure Link from Typography

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
    <div style={styles.container}>
      <Card style={styles.card} title="Login" bordered={false}>
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Login
          </Button>
        </Form>

        {/* Hyperlink to navigate to the Register page */}
        <div style={styles.linkContainer}>
          <Link onClick={() => navigate('/register')}>Don't have an account? Register here</Link>
        </div>
      </Card>
    </div>
  );
};

// Styles to center the card and give a modern look
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  linkContainer: {
    marginTop: '10px',
    textAlign: 'center',
  },
};

export default Login;
