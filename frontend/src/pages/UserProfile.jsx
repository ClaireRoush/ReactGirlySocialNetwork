import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function UserProfile() {
    let { userId } = useParams();
    const [username, setUsername] = useState("")

    useEffect(() => {
        fetch(`https://reactgirlysocialnetwork-backend-dzs8.onrender.com/${userId}`)
        .then(response => response.json())
        .then(data => {
                setUsername(data.username);
            })
        }, [],)
        
    
    return (
        <div >
            <div>Post by cutie: {username}</div>
        </div>
    )
}