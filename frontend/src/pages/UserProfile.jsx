import React, { useEffect, useState } from "react";
import Post from "./Post";
import { useParams } from "react-router-dom";
export default function UserProfile() {
    const { userId } = useParams();
    const [posts, setPosts] = useState([])
    const [username, setUsername] = useState("")

    useEffect(() => {
        fetch(`https://reactgirlysocialnetwork-backend-dzs8.onrender.com/userProfile/${userId}`)
        .then(response => response.json())
        .then(data => {
                setUsername(data.username);
            })
        }, [],);

    useEffect(() => {
        fetch(`https://reactgirlysocialnetwork-backend-dzs8.onrender.com/userProfile/posts/${userId}`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        })
    }, [])
    
    
    return (
        <div >
            <div>Post by cutie: {username}
            {posts.length > 0 && posts.map(post => (
            <Post {...post} />
        ))}

            </div>
        </div>
    )
}