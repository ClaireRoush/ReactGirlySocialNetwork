import React, { useEffect, useState } from "react";
import Styles from "../css/UserProfile.module.css";
import Post from "./Post";
import { useParams, Link } from "react-router-dom";
export default function UserProfile() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

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
    /* НАСРАНО */
    <div className={Styles.fullProfile}>
      <div className={Styles.upperProfileContainer}>
        <div className={Styles.upperProfile}>
          <img className={Styles.profileImg} src={userAvatar} />
          <div className={Styles.desc}>
            <h1>{username}</h1>
            <textarea></textarea>
          </div>
        </div>
      </div>
      <div className={Styles.profileInfo}>
        <div className={Styles.profilePosts}>
          {posts.length > 0 && posts.map((post) => <Post {...post} />)}
        </div>
      </div>
      <div className={Styles.links}>
        <Link to="/">Back</Link>
        <Link to="/settings">Settings</Link>
      </div>
    </div>
  );
}
