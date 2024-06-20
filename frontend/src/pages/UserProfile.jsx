import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function UserProfile() {
    let { userId } = useParams();
    const [username, setUsername] = useState("")

    useEffect(() => {
        fetch(`http://localhost:6969/userProfile/${userId}`)
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