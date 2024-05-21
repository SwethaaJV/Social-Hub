import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate  } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import Axios from 'axios';
import { Button, Input, Table, message as antdMessage } from 'antd';
import PostModal from './PostModal';
import { setPostId } from '../store';
import { deletePostAsync, publishPostAsync} from '../actions';
import './Posts.scss';

function Posts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isPostModalOpen, setPostIsModalOpen] = useState(false);
  const [searchPost,setSearchPost]=useState('');

  const [data_value, setData] = useState([]);
  let response;
  let order ="desc";
  let search=searchPost;

  const fetchData = async () => {
      try {
          let accessToken = localStorage.getItem('Token');
          response = await Axios.get(
              `https://react-assignment-api.mallow-tech.com/api/posts?limit=10&page=1&sort=name&order=${order}&search=${search}`,
              {
                  headers: {
                      Authorization: accessToken,
                  },
              }
          );
          setData(response.data.data);
      } catch (error) {
          console.log(error);
      }
  };

  useEffect(() => {
      fetchData();
  }, [searchPost]);

  const handleSearchPost=(e)=>{
    setSearchPost(e.target.value);
  }

  const openPostModal = () => {
    setPostIsModalOpen(true);
  };

  const formatDateTime=(time)=>{
    
    const formattedDate = new Date(time).toLocaleDateString("en-US",{
      year: "numeric",
      month:"numeric",
      day:"numeric",
    });
    const formattedTime = new Date(time).toLocaleTimeString("en-US",{
      hour:"numeric",
      minute:"numeric",
      hour12:true,
    });
    return `${formattedDate}, ${formattedTime}`;
  }


  const handlePostOk = async ({ blogTitle, coverImage, content }) => {
    console.log('Post submitted:', { blogTitle, coverImage, content });
    let access = localStorage.getItem('Token');
    const formData = new FormData();
    formData.append('name', blogTitle);
    formData.append('content', content);
    formData.append('image', coverImage);
    try {
      const response = await Axios.post(
        'https://react-assignment-api.mallow-tech.com/api/posts',
        formData,
        {
          headers: {
            Authorization: access,
          },
        }
      );
      console.log('Post creation successful', response.data);
      fetchData();
      antdMessage.success('Post created successfully!');
      setPostIsModalOpen(false);


    } catch (error) {
      console.log('Post creation failed', error);
      antdMessage.error('Post creation failed. Please try again.');
    }
  };

  const handlePostCancel = () => {
    setPostIsModalOpen(false);
  };

  const handleTitleOnClick = (postId) => {
    dispatch(setPostId(postId));
    console.log('Clicked Post ID:', postId);
    navigate(`/preview/${postId}`);
  };

  const handleUnpublish = async (postId, postValue) => {
    dispatch(publishPostAsync(postId, postValue));
    fetchData();
  };

  const handleDelete = async (postId) => {
    dispatch(deletePostAsync(postId));
    fetchData();
  };

  const columns = [
    {
      title: 'Post Name',
      dataIndex: 'name',
      key: 'name',
      className: 'post-name-cell',
      onCell: (record) => ({
        onClick: () => handleTitleOnClick(record.id),
      }),  
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record) => (
        <span>{formatDateTime(record.created_at)}</span>
      ),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text, record) => (
        <span>{formatDateTime(record.updated_at)}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleUnpublish(record.id,record.is_published)}>
            {record.is_published ? "Unpublish" : "Publish" }
          </Button>
          <Button type="danger" onClick={() => handleDelete(record.id)} className='Post-delete-btn-danger'>
            Delete
          </Button>
        </span>
      ),
    },
  ];


  return (
    <div className='post-layout'>
      <div className='post-header1'>
        <h1 className='post-heading'>Posts</h1>
        <span className='post-header2'>
          <Input
            className='post-search'
            prefix={<SearchOutlined />}
            placeholder='Search'
            value={searchPost} 
            onChange={handleSearchPost}
          />
          <Button type='primary' onClick={openPostModal}>
            Create
          </Button>
          <PostModal
            visible={isPostModalOpen}
            onCancel={handlePostCancel}
            onOk={handlePostOk}
          />
        </span>
      </div>
      <Table className='post-table' dataSource={data_value}
       columns={columns}
        pagination={false} rowKey='id'
        />

    </div>
  );
}

export default Posts;
