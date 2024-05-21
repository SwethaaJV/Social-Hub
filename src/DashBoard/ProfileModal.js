import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const ProfileModal = ({ visible, onCancel, onOk,firstName,lastName }) => {
  const [FirstName, setFirstName] = useState(firstName);
  const [LastName, setLastName] = useState(lastName);
  const [profileImage, setProfileImage] = useState('');

  useEffect(()=>{
    setFirstName(firstName);
    setLastName(lastName);
  },[firstName, lastName])

  const handleFirstNameChange=(e)=>{
    setFirstName(e.target.value);
  }
  const handleLastNameChange=(e)=>{
    setLastName(e.target.value);
  }
  const handleProfileChange=(e)=>{
    setProfileImage(e.target.files[0]);
  }

  return (
    <Modal
      title="Profile"
      open={visible}
      onCancel={onCancel}
      onOk={() => onOk({ FirstName, LastName, profileImage })}
      width={300}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => onOk({ FirstName, LastName, profileImage })}>
          Submit
        </Button>,
      ]}
    >
      <Form name="update_profile"
                  autoComplete='off'
                  colon={false}
                  initialValues={{
                    first_name:firstName,
                    last_name:lastName,
                  }}
                  layout='vertical'>
        <Form.Item name="first_name"
                   label="First Name"
                   rules={[
                    {
                      type: 'string',
                      required:true,
                    }
                   ]}>
                    <Input className='update-Input' onChange={handleFirstNameChange} value={FirstName}/>
        </Form.Item>
        <Form.Item name="last_name"
                   label="Last Name"
                   rules={[
                    {
                      type: 'string',
                      required:true,
                    }
                   ]}>
                    <Input className='update-Input' onChange={handleLastNameChange} value={LastName}/>
        </Form.Item>
        <Form.Item name="profile_image"
                   label="Profile Image"
                   rules={[
                    {
                      required:true,
                    }
                   ]}>
                    <Input className='update-Input' type='file' onChange={handleProfileChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
