import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { useRegisterMutation } from '../api/authApi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate(); // Initialize navigate function

  const handleRegister = async (values) => {
    if (values.password !== values.re_password) {
      message.error("Passwords don't match!");
      return;
    }
    try {
      const data = await register(values).unwrap();
      message.success('Registration successful!');
      console.log(data); // Handle user data

      // Navigate to the login page after successful registration
      navigate('/login');
    } catch (error) {
      message.error(error.data?.email?.[0] || 'Registration failed!');
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} title="Register" bordered={false}>
        <Form onFinish={handleRegister} layout="vertical">
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Confirm Password" name="re_password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Register
          </Button>
        </Form>
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
};

export default Register;
