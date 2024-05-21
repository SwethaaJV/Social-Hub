import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';
import axios from 'axios';
import Right from '../Right.svg';
import './SignIn.scss';

function SignIn () {
  
  const navigate = useNavigate();

   const [email,setEmail]=useState('');
   const [password,setPassword]=useState('');

   const handleEmailChange=(e)=>{
    setEmail(e.target.value);
   }
   const handlePasswordChange=(e)=>{
    setPassword(e.target.value);
   }

   const Information={
    "email":"",
    "password":""
   };

   Information.email=email;
   Information.password=password;


  const handleFinish = async () => {

      try {
        const response = await axios.post('https://react-assignment-api.mallow-tech.com/api/login',
          Information
        );
        console.log('Login successful!', response.data);
        const token = response.headers.get('Authorization');
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem("Token",token);
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem("authentication","true");
        navigate('/dashboard/display');
       
      } catch (error) {
        console.error('Login failed!', error);
      }
    
  };

  return (
    <div className='outer'>
    <div className='container'>
     <div className='form'>
      <h2 className='text'>Sign In to your Account</h2>
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
          name="email"
          rules={[
            {
              type: 'email',
              required:true,
              message: 'The input is not valid E-mail!',
            },
          ]}
        >
          <Input placeholder="Email"
                 onChange={handleEmailChange} 
                 allowClear/>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              type:"string",
              required: true,
              message: 'Please input your Password!',
              min:8,
            },
          ]}
        >
          <Input type="password"
           placeholder="Password"
           allowClear
           hidden
           onChange={handlePasswordChange} />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Save Password</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="">
            Forgot password?
          </a>
        </Form.Item>

        <Form.Item className='text'>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Sign in
          </Button>
          Don't have an Account? <Link to="/">Sign up</Link>
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

export default SignIn;