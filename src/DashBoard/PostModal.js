import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const PostModal = ({ visible, onCancel, onOk, isEditing, editData }) => {
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleValuesChange = (_, allValues) => {
    const { name, content, image_url } = allValues;
    const allFieldsFilled = name && content && image_url;
    setSubmitDisabled(!allFieldsFilled);
  };


  let BLOG='';
  let CONTENT='';
  let IMAGE='';

if(isEditing){
  BLOG= editData.name;
  CONTENT=editData.content;
  IMAGE=editData.image_url;
}

    const [blogTitle, setBlogTitle] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [content, setContent] = useState('');


    useEffect(() => {
      if (isEditing) {
          setBlogTitle(BLOG);
          setContent(CONTENT);
          setCoverImage(IMAGE);
      }
  }, [isEditing, BLOG,CONTENT]);

    const handleBlogTitleChange=(e)=>{
        setBlogTitle(e.target.value);
    }
    const handleCoverImageChange=(e)=>{
        const file = e.target.files[0];
        const allowedFormats = ['image/jpeg', 'image/png'];
        const maxSizeInBytes = 2 * 1024 * 1024; 
      
        if (file) {
          if (!allowedFormats.includes(file.type)) {
            console.error('Invalid file format. Please select a JPG or PNG file.');
            return;
          }
          if (file.size > maxSizeInBytes) {
            console.error('File size exceeds 2MB limit. Please select a smaller file.');
            return;
          }
          setCoverImage(file);
        }
      }
      
    const handleContentChange=(e)=>{
        setContent(e.target.value);
    }

    const handleOnOk=()=>{
      onOk({ blogTitle, coverImage, content });
      form.resetFields();

    }

    return(
        <Modal
        title={isEditing ? 'Edit Post' : 'Create Post'}
        open={visible}
        onCancel={onCancel}
        width={300}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOnOk} disabled={submitDisabled}>
            Submit
          </Button>,
        ]}
      >
        <Form name="create_post"
                    autoComplete='off'
                    colon={false}
                    layout='vertical'
                    initialValues={{
                      name:BLOG,
                      content:CONTENT,
                    }} 
                    onValuesChange={handleValuesChange}
                    form={form}>
          <Form.Item name="name"
                     label="Blog Title"
                     rules={[
                      {
                        type: 'string',
                        required:true,
                        message:"Please input the blog title"
                      }
                     ]}>
                      <Input name="Blog_Title" className='update-Input' onChange={handleBlogTitleChange} />
          </Form.Item>
          <Form.Item name="image_url"
                     label="Cover Image"
                     rules={[
                      {
                        required:true,
                        message:"Please input the Cover Image"
                      }
                     ]}>
                      <Input name="Cover_image" className='update-Input' type='file' onChange={handleCoverImageChange} />
          </Form.Item>

          <Form.Item name="content"
                     label="content"
                     rules={[
                      {
                        type: 'string',
                        required:true,
                        message:"Please input the Content"
                      }
                     ]}>
                      <Input.TextArea name="Content" className='update-Input' onChange={handleContentChange} 
                                autoSize={{
                                    minRows: 3,
                                    maxRows: 5,
                       }}/>
          </Form.Item>
        </Form>
      </Modal>
  
    );
}
export default PostModal;