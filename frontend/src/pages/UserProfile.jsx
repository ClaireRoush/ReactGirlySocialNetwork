import React, { useEffect, useState } from "react";
import Styles from "../css/UserProfile.module.css";
import Post from "./Post";
import { useParams, Link } from "react-router-dom";
export default function UserProfile() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");http://localhost:3000/

  useEffect(() => {
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/userProfile/${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.username);
        setUserAvatar(data.userAvatar);
      });
  }, []);

  useEffect(() => {
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/userProfile/posts/${userId}`
    ).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);

  return (
    <div className={Styles.fullProfile}>
      <Link to={"/"}>
        <a>Back</a>
      </Link>

      <Link to={"/settings"}>
        <a>Settings</a>
      </Link>
      <img className={Styles.userProfile} src={userAvatar}></img>
      <div>
        Post by cutie: {username}
        {posts.length > 0 && posts.map((post) => <Post {...post} />)}
      </div>
    </div>
  );
}
