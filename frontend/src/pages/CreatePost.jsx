import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom';
const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };


export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [redirect, setRedirect] = useState(false)
    async function createNewPost(ev) {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('image', image);
      /*data.set('file', files[0]); */
      ev.preventDefault();

      const response = await fetch('http://localhost:6969/post', {
        method: "POST",
        body: data,
        credentials: 'include',
      });
      if (response.ok) {
        setRedirect(true);
      }
    }

    if (redirect) {
      return <Navigate to={'/'} />;
  }
    return (
        <div>
            <div>
                <form onSubmit={createNewPost}>
                    <input 
                    type="title" 
                    placeholder="Title" 
                    value={title} 
                    onChange={ev => setTitle(ev.target.value)} 
                    />

                    <input
                    type="summary"
                    placeholder="Summary"
                    value={summary}
                    onChange={ev => setSummary(ev.target.value)} 
                    />
 
                    <input 
                    type="background"
                    placeholder='image url'
                    value={image} 
                    onChange={ev => setImage(ev.target.value)} 
                    />

                    <ReactQuill 
                    value={content} 
                    onChange={setContent} 
                    modules={modules}  
                    />

                    <button >Post</button>
                    
                </form>
            </div>
        </div>
    )
}

