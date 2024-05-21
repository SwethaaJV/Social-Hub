import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import { Button, Card, Layout, Space, Spin } from 'antd';
import { useNavigate  } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { deletePostAsync, publishPostAsync, editPostAsync, fetchPostDataById } from '../actions';
import PostModal from './PostModal';
import './Preview.scss';

const { Content } = Layout;


function Preview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
    
  const postId = useSelector((state) => state.postId);
  const [postDetails, setPostDetails] = useState(null);

  const handleDelete = async (postId) => {
    dispatch(deletePostAsync(postId));
    navigate("/dashboard/posts");
  };

  const handleUnpublish = async (postId, postValue) => {
    dispatch(publishPostAsync(postId, postValue));
  };
 
  const handleEditOnClick = async(postId) => {
    try {
      const postData = await fetchPostDataById(postId);
      if (postData) {
        setEditData(postData);
        setEditModalOpen(true);
      } else {
        console.error('Post data not available.');
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  const handleEditOk = async ({ blogTitle, coverImage, content }) => {
     dispatch(editPostAsync(editData.id, { name: blogTitle, image: coverImage, content }));
     setEditModalOpen(false);
  };
  
  const handleEditCancel = () => {
     setEditModalOpen(false);
  };
  const handleBack=()=>{
    navigate("/dashboard/posts");
  }


  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        if (postId == null) {
            console.error('postId is undefined or null');
            return;
          }
  
        const accessToken = localStorage.getItem('Token');
        const response = await Axios.get(
          `https://react-assignment-api.mallow-tech.com/api/posts/${postId}`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        setPostDetails(response.data);
      } catch (error) {
        console.log('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [postId,postDetails]);

  if (!postDetails) {
    return <div className='Loading'><Spin /></div>;
  }

  return (
    <Space direction='vertical'
           className='Preview-space'
           size={[0,48]} >
            <Layout className='Preview-Layout'>
                <Content className='Preview-Content'>
                    <Card className='Preview-Card'>
                    <div>
      <div className='Preview-Buttons'>
        <span>
        <Button className='Back-btn' icon={<LeftOutlined />} onClick={handleBack}>Back</Button>
        </span>
      
      <span>
      <Button className='Preview-Delete-btn' type='danger' onClick={()=>handleDelete(postDetails.id)}>Delete</Button>
      <Button className='Preview-Button-align' type='primary' onClick={()=>handleEditOnClick(postDetails.id)}>Edit</Button>
      <Button className='Preview-Button-align' type='primary' onClick={() => handleUnpublish(postDetails.id,postDetails.is_published)}>
      {postDetails.is_published ?  "Unpublish" : "Publish" }</Button>
      </span>
      </div>

      <img src={postDetails.image_url} alt={postDetails.name} className='Preview-image'/>
      <h3>{postDetails.name}</h3>
      <p>{postDetails.content}</p>
    </div>
    <PostModal
        visible={isEditModalOpen}
        onCancel={handleEditCancel}
        onOk={handleEditOk}
        isEditing={!!editData}
        editData={editData}
      />
                    </Card>
                </Content>
            </Layout>
           </Space>
  );
}

export default Preview;

