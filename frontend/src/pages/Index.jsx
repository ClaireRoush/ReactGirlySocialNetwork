import React, { useEffect, useState } from 'react'
import Post from "./Post"
import Header from "./Header"
import Styles from "../css/UserProfile.module.css"

export default function IndexPage() {
    
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch('http://localhost:6969/post').then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        })
    }, [])


    return (
      <div >
        <div className={Styles.UserProfile}>
        <Header/>
        </div>
        {posts.length > 0 && posts.map(post => (
            <Post {...post}/>
        ))}
      </div>
    )
  }
