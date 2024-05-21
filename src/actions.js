import Axios from 'axios';
import {message as antdMessage } from 'antd';

export const DELETE_POST = 'DELETE_POST';
export const PUBLISH_POST = 'PUBLISH_POST';
export const EDIT_POST = 'EDIT_POST';

export const deletePost = (postId) => ({
  type: DELETE_POST,
  payload: postId,
});

export const publishPost = (postId, postValue) => ({
  type: PUBLISH_POST,
  payload: { postId, postValue },
});

export const editPost = (postId, postData) => ({
    type: EDIT_POST,
    payload: { postId, postData },
  });

export const deletePostAsync = (postId) => async (dispatch) => {
  try {
    let access = localStorage.getItem('Token');
    await Axios.delete(`https://react-assignment-api.mallow-tech.com/api/posts/${postId}`, {
      headers: {
        Authorization: access,
      },
    });
    dispatch(deletePost(postId));
    console.log("post deleted successfully",postId);
    antdMessage.success('Post deleted successfully!');
  } catch (error) {
    console.log('Delete post failed', error);
  }
};

export const publishPostAsync = (postId, postValue) => async (dispatch) => {
  let boolValue = postValue ? 'false' : 'true';
  let publishValue = postValue ? 'unpublish' : 'publish';
  try {
    let access = localStorage.getItem('Token');
    const response = await Axios.post(
      `https://react-assignment-api.mallow-tech.com/api/posts/${postId}/publish/${boolValue}`,
      null,
      {
        headers: {
          Authorization: access,
        },
      }
    );
    console.log(response.data);
    dispatch(publishPost(postId, postValue));
    antdMessage.success(`Post ${publishValue} successfully!`);
    
  } catch (error) {
    console.log('Unpublish post failed', error);
  }
};

export const fetchPostDataById = async (postId) => {
    try {
      let accessToken = localStorage.getItem('Token');
      const response = await Axios.get(
        `https://react-assignment-api.mallow-tech.com/api/posts/${postId}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      console.log("fetched data is",response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching post data by ID:', error);
      return null;
    }
  };

export const editPostAsync = (postId, postData) => async (dispatch) => {

    try {
      let access = localStorage.getItem('Token');
      const formData = new FormData();
      formData.append('name', postData.name);
      formData.append('content', postData.content);
      formData.append('image', postData.image);
      formData.append('_method','patch');
      const response = await Axios.post(
        `https://react-assignment-api.mallow-tech.com/api/posts/${postId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
            'Authorization': access,
          },
        }
      );
      dispatch(editPost(postId, postData));
      console.log("post edited successfully", response.data);
      antdMessage.success('Post edited successfully!');
    } catch (error) {
      console.log('Edit post failed', error.response.data);
    }
  };
  
