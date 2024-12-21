import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRegisterMutation } from '../api/authApi';

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async (values) => {
    if (values.password !== values.re_password) {
      message.error("Passwords don't match!");
      return;
    }
    try {
      const data = await register(values).unwrap();
      message.success('Registration successful!');
      console.log(data); // Handle user data
    } catch (error) {
      message.error(error.data?.email?.[0] || 'Registration failed!');
    }
  };

  return (
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
      <Button type="primary" htmlType="submit" loading={isLoading}>
        Register
      </Button>
    </Form>
  );
};

export default Register;
