import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Outlet, useNavigate  } from 'react-router-dom';
import { Layout, Space, Dropdown, Button, message as antdMessage} from 'antd';
import ProfileModal from './ProfileModal';
import defaultuserImage from './user_image.png';
import Logo from './Logo-1.svg';
import profileIcon from './Profile-icon.png';
import LogoutIcon from './logout-icon.jpeg';
import './Headerbar.scss';

const { Header, Content } = Layout;

function HeaderBar(){
    const navigate = useNavigate(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [profileImage, setProfileImage] = useState(defaultuserImage);
    const [profileUpdated, setProfileUpdated] = useState(false);
    const path=window.location.pathname
    
    const showModal = () => {
      setIsModalOpen(true);
    };

    useEffect(() => {
      const fetchUserData = async () => {
        const access = localStorage.getItem('Token');
        try {
          const response = await Axios.get(
            'https://react-assignment-api.mallow-tech.com/api/validate-user',
            {
              headers: {
                Authorization: access,
              },
            }
          );
          setFirstName(response.data.first_name);
          setLastName(response.data.last_name);
          response.data.profile_url ? setProfileImage(response.data.profile_url) : setProfileImage(defaultuserImage) ;
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchUserData();
    }, [profileUpdated]);
  
    const handleOk = async({ FirstName, LastName, profileImage }) => {
  
        if (FirstName.trim() === '' || LastName.trim() === '') {
          antdMessage.warning('All fields are required');
        } else {
          console.log('Form submitted:', { FirstName, LastName, profileImage });
          let access=localStorage.getItem('Token');
          const formData=new FormData();
           formData.append('first_name',FirstName);
           formData.append('last_name',LastName);
           formData.append('image',profileImage);
           formData.append('_method','patch');
           try{
              const response = await Axios.post(
                 'https://react-assignment-api.mallow-tech.com/api/update/profile',
                 formData,
                 {
                   headers: {
                     Authorization: access,
                   },
                 }
               );
               console.log("profile Updation Successful",response.data);
               antdMessage.success('Profile updated successfully!');
               setProfileImage(response.data.image); 
               setProfileUpdated((prev) => !prev); 
               setIsModalOpen(false);
              }
            catch(error){
              console.error('Updation failed',error);
              antdMessage.error('Update failed. Please try again.');
            }
          
         }
      };
      
    const handleCancel = () => {
       setIsModalOpen(false);
    };

    const handleLogout = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        try {
          const res=await Axios.delete('https://react-assignment-api.mallow-tech.com/api/logout',{
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'Authorization': token
            }
          });
          console.log(res.data);
          localStorage.setItem("authentication","false");
          navigate('/signin');
          
        } catch (error) {
          console.error('Logout failed:', error);
        }
    };

    const items = [
        {
          key: '1',
          label: 'Profile',
          icon: <img src={profileIcon} className='menu-item-icon' alt='profile icon' />,
          onClick: showModal,
        },
        {
          key: '2',
          label: 'Logout',
          icon: <img src={LogoutIcon} className='menu-item-icon' alt='logout icon' />,
          onClick: handleLogout,
        },
      ];
      return(
        <>
        <Space direction='vertical'
        className='header-space'
         size={[0,48]}>
          <Layout>
          <Header className='header'>
          <nav className='background'>
            <img src={Logo} className="App-logo" alt="logo" />
            <ul className='list'>
                <li ><a href="/dashboard/display" className={path==='/dashboard/display' ? 'active':''}>Dashboards</a> </li>
                <li><a href="/dashboard/posts" className={path==='/dashboard/posts' ? 'active':''}>Posts</a></li>
            </ul>
            <h3 className='UserName'>{firstName}</h3>
            <nav className='profile-icon'>
            <Dropdown
             menu={{
                items,
             }}
            placement="bottom"
            arrow>
              <Button className='profile-button' icon={<img src={profileImage} className='profile' alt='profile' />} />
            </Dropdown>
            </nav>
        </nav>
        <ProfileModal visible={isModalOpen} onCancel={handleCancel} onOk={handleOk} firstName={firstName} lastName={lastName}/>

          </Header>
          
          <Content className='content-Layout'>
          <Outlet />
          </Content>
          </Layout>
         </Space>

        </>
    )
}
export default HeaderBar;