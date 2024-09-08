import React, { useEffect, useState } from "react";
import Styles from "../css/UserProfile.module.css";
import Header from "./Header";
import Post from "./Post";

export default function Me() {
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [posts, setPosts] = useState([]);
  const [pronouns, setPronouns] = useState("");
  const [profileHashColor, setprofileHashColor] = useState("#a6e3a1");
  const token = localStorage.getItem("token");

  const userId = username;

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + `/me`, {
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
        }).catch((error) => {
          console.error("Error fetching user profile:", error);
        });
      }
    });
  }, [token]);

  useEffect(() => {
    fetch(
      process.env.REACT_APP_API_URL + `/userProfile/posts/${userId}`
    ).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      }).catch((error) => {
        console.error("Error fetching posts:", error);
      });
    });
  }, [username]);

  return (
    <div className={Styles.fullProfile}>
      <Header></Header>

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
    </div>
  );
}
