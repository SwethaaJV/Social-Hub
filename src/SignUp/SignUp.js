import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import Right from '../Right.svg';
import './SignUp.scss';
 
function SignUp(){
  const navigate = useNavigate();

  const [firstname,setFirstname]=useState('');
  const [lastname,setLastname]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');

  const handleFnameChange=(e)=>{
    setFirstname(e.target.value);
  }
  const handleLnameChange=(e)=>{
    setLastname(e.target.value);
  }
  const handleEmailChange=(e)=>{
    setEmail(e.target.value);
   }
   const handlePasswordChange=(e)=>{
    setPassword(e.target.value);
   }
   const handleConfirmPasswordChange=(e)=>{
    setConfirmPassword(e.target.value);
   }

  const Information={
    "email": "",
    "first_name": "",
    "last_name": "",
    "password": "",
    "password_confirmation": ""
  }

  Information.email=email;
  Information.first_name=firstname;
  Information.last_name=lastname;
  Information.password=password;
  Information.password_confirmation=confirmPassword;

  const handleFinish = async () => {
        try {
          const response = await axios.post('https://react-assignment-api.mallow-tech.com/api/register', Information);
          const token = response.headers.get('Authorization');
          localStorage.setItem('token', JSON.stringify(token));
          localStorage.setItem("Token", token);
          console.log('Registration successful!', response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem("authentication","true");
          navigate('/dashboard/display');
        } catch (error) {
          console.error('Registration failed!', error);
        }
  };

  return (
    <div className='outer'>
        <div className='container'>
        <div className='form'>
      <h2 className='text'>Sign Up for an Account</h2>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleFinish}
        autoComplete='off'
      >

       <Form.Item
          name="first_name"
          rules={[
            {
              type:"string",
              required: true,
              message:"first name is required",
            },
          ]}
          className='FirstName' >
           <Input placeholder="First Name"
               onChange={handleFnameChange}
               allowClear />
        </Form.Item>

       <Form.Item
          name="last_name"
          rules={[
            {
              type:"string",
              required: true,
              message:"last name is required"
            },
          ]}
          className='LastName'>
          <Input placeholder="Last Name" 
                onChange={handleLnameChange}
                 allowClear/>
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}>
          <Input placeholder="Email"
                 onChange={handleEmailChange}
                 allowClear/>
         </Form.Item>
         <Form.Item
           name="password"
           rules={[
             {
               required: true,
               message: 'Please input your Password!',
             },
             {
               min: 8,
               message: 'Password must be at least 8 characters long.',
             },
           ]}>
           <Input
             type="password"
             placeholder="Password"
             onChange={handlePasswordChange}
             allowClear />
         </Form.Item>
         <Form.Item
           name="password_confirmation"
           dependencies={['password']}
           rules={[
             {
               required: true,
               message: 'Please confirm your password!',
             },
             ({ getFieldValue }) => ({
               validator(_, value) {
                 if (!value || getFieldValue('password') === value) {
                   return Promise.resolve();
                 }
                 return Promise.reject(new Error('The new password that you entered do not match!'));
               },
             }),
           ]} >
           <Input 
            type="password"
            placeholder="Confirm Password"
            onChange={handleConfirmPasswordChange}
            allowClear />
         </Form.Item>

         <Form.Item className='text'>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Sign Up
            </Button>
           Already have an Account? <Link to="/Signin">Sign In</Link>
         </Form.Item>
       </Form>
    </div>
        </div>
        <div className='image-container'>
          <img src={Right} className='image'></img>
        </div>
    </div>
  );
};

export default SignUp;