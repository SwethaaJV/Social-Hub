import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Form, Input, Button, Skeleton, message as antdMessage} from 'antd';
import userImage from './user_image.png';
import './PostView.scss';

function PostView({ selectedPost }) {
      const [postData, setPostData] = useState(null);
      const [comments,setComments]=useState(null);
      const [form] = Form.useForm();

      const handleCommentsChange=(e)=>{
        setComments(e.target.value);
      }

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        if (selectedPost && selectedPost.postViewId) {
          const response = await axios.get(
            `https://react-assignment-api.mallow-tech.com/api/public/posts/${selectedPost.postViewId}`
          );
          setPostData(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [selectedPost]);

    if (postData) {   

      const CommentInfo={
        "comment":""
      };
      CommentInfo.comment=comments;

      const handleCommentSubmit = async()=>{
        const accessToken = localStorage.getItem('Token');
        try{
          const response=await axios.post(`https://react-assignment-api.mallow-tech.com/api/posts/${selectedPost.postViewId}/comments`,CommentInfo,
          {
            headers: {
              Authorization: accessToken,
            },
          });
          console.log('Comment added',response.data);
          antdMessage.success('Comment added successfully!');
          
          form.resetFields();
      
        }
        catch(error){
          console.error('Comment added failed!', error);
        }
      }
      const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          form.submit();
        }
      };

      return (
        <div className='Post-view'>
            <div className='Profile-info'>
            {selectedPost.ProfileImage ? (
            <img src={selectedPost.ProfileImage} alt={selectedPost.postViewId} className='profile-view-image' />
          ) : (
            <img src={userImage} alt={selectedPost.postViewId} className='profile-view-image' />
          )}

            <div>
            <h4 className='Profile-text'>{selectedPost.firstName}</h4>
            <p className='Profile-text'>{selectedPost.createdAt}</p>
            </div>
            </div>
            <img src={selectedPost.ImageUrl} alt={selectedPost.postViewId} className='post-view-image' />
            <h3>{selectedPost.postName}</h3>
            <p>{postData.content}</p>
            <Form 
              name='comment-section'
              form={form}
              layout='inline'
              onFinish={handleCommentSubmit}
              autoComplete='off' 
              onKeyPress={handleEnterPress} >
                <Form.Item
                  name='comment'
                  rules={[
                    {
                      required: true,
                    }
                  ]}>
                     <Input
                       className='post-comments'
                       placeholder='comments...'
                       value={comments}
                       onChange={handleCommentsChange}
                       />
                  </Form.Item>
              </Form>
        </div>
      );
    }
  
    return (
      <div className='Post-view'>
        <Skeleton.Avatar active className='Skeleton-Avatar'/>
        <Skeleton.Input active className='Skeleton-Input'/>
        <div>
        <Skeleton.Image active className='Skeleton-Image'/>
        <Skeleton active className='Skeleton-Content'/>
        <Skeleton.Input active className='Skeleton-Comment'/>
        </div>
      </div>
    );
  }
  
  export default PostView;
  
