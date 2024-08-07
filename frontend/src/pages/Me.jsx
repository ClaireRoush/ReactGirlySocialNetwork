import React, { useEffect, useState } from "react";
import Styles from "../css/UserProfile.module.css";
import { Link } from "react-router-dom";
import Post from "./Post";

export default function Me() {
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [posts, setPosts] = useState([]);
  const [pronouns, setPronouns] = useState("");
  const [profileHashColor, setprofileHashColor] = useState("#a6e3a1");

  const userId = username;

  useEffect(() => {
    fetch("https://reactgirlysocialnetwork-backend-dzs8.onrender.com/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json().then((info) => {
          setUsername(info.username);
          setUserAvatar(info.userAvatar);
          setUserDesc(info.userDesc);
          setPronouns(info.pronouns);
          setprofileHashColor(info.profileHashColor);
        });
      }
    });
  }, [token]);

  useEffect(() => {
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/userProfile/posts/${userId}`
    ).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, [username]);

  return (
    <div className={Styles.fullProfile}>
      <div className={Styles.upperProfileContainer}>
        <div className={Styles.upperProfile}>
          <img className={Styles.profileImg} src={userAvatar} />
          <div className={Styles.desc}>
            <h1>{username}</h1>
            <textarea placeholder={userDesc}></textarea>
            <a>{pronouns}</a>
          </div>
        </div>
      </div>
      <div className={Styles.profileInfo}>
        <div className={Styles.profilePosts}>
          {posts.length > 0 &&
            posts.map((post) => <Post {...post} color={profileHashColor} />)}
        </div>
      </div>
      <div className={Styles.links}>
        <Link to="/">Back</Link>
        <Link to="/settings">Settings</Link>
      </div>
    </div>
  );
}
