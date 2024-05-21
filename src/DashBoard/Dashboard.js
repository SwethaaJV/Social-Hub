import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Input, List ,Skeleton} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PostView from './PostView';
import './Dashboard.scss';

function DashBoard() {
  const [posts, setPosts] = useState([]);
  const [searchPost, setSearchPost] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchData = async (newOffset = offset, newSearchPost = searchPost) => {
    try {
      let accessToken = localStorage.getItem('Token');
      const response = await Axios.get(
        `https://react-assignment-api.mallow-tech.com/api/public/posts?offset=${newOffset}&search=${newSearchPost}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

     const newPosts = response.data.map((post) => ({
        ...post,
        formattedCreatedAt: new Date(post.user.created_at).toLocaleDateString('en-GB', {
           day: 'numeric',
           month: 'short',
           year: 'numeric',
        }),
        uniqueKey: `${post.id}_${post.name}`, 
      }))
       console.log(response.data);

       if (newPosts.length > 0){
        if ( newOffset !== 1){
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        } else{
          setPosts(newPosts);
        }
        setOffset(newOffset + 1);
       }

     setHasMore(newPosts.length > 0);
    //  setOffset(newOffset + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
     }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchPost = (e) => {
    const { value } = e.target;
    setSearchPost(value);
    setOffset(1);
    fetchData(1, value); 
  };

  const fetchMoreData = () => {
    console.log('reached end');
    if (hasMore) {
      fetchData(offset + 1); 
    }
  };

  const handlePostOnClick=(postId,postName,createdAt,ImageUrl,firstName,ProfileImage)=>{
    setSelectedPost({
      postViewId: postId,
      postName,
      createdAt,
      ImageUrl,
      firstName,
      ProfileImage,
    });
  }

  return (
    <>
      <div className='Post-view-layout'>
        <div className='sidebar'>
          <div className='sidebar-header'>
            <h4 className='published-blogs'>Published blogs</h4>
            <Input
              className='post-search'
              prefix={<SearchOutlined />}
              placeholder='Search'
              value={searchPost}
              onChange={handleSearchPost}
            />
          </div>
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={          <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />}
            height={500}
          >
            <List 
              dataSource={posts}
              renderItem={(post) => (
                <List.Item className='list-items' key={post.uniqueKey} onClick={() => 
                  handlePostOnClick(post.id,post.name,post.formattedCreatedAt,post.image_url,post.user.first_name,post.user.profile_url
                  )}>
                  <img src={post.image_url} alt={post.name} className='post-card-image' />
                  <div className='list-item-text'>
                    <h4 className='image-title'>{post.name.length > 15 ? `${post.name.slice(0, 20)}...` : post.name}</h4>
                    <p className='image-body'>
                      {post.user.first_name},{post.formattedCreatedAt}
                    </p>
                  </div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>

        <div className='post-content'>
          <PostView selectedPost={selectedPost} />
        </div>
      </div>
    </>
  );
}

export default DashBoard;

