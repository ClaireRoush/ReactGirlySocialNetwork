import React, { useEffect, useState, useContext } from "react";
import Styles from "../css/UserProfile.module.css";
import { UserContext } from "../usercontext";
import Post from "./Post";
import { useParams, Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Header from "./Header";

export default function UserProfile() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [profileHashColor, setprofileHashColor] = useState("#a6e3a1");
  const [userDesc, setUserDesc] = useState("");
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/userProfile/${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.username);
        setUserAvatar(data.userAvatar);
        setUserDesc(data.userDesc);
        setPronouns(data.pronouns);
        setprofileHashColor(data.profileHashColor);
      });
  }, [userId]);

  async function AddToContacts(ev) {
    ev.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/addToContacts/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );
  }

  useEffect(() => {
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/userProfile/posts/${userId}`
    ).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, [userId]);

  useEffect(() => {
    if (username === userInfo?.username) {
      setRedirect(true);
    }
  }, [username, userInfo]);

  if (redirect) {
    return <Navigate to={"/me"} />;
  }

  return (
    /* НАСРАНО */
    <div className={Styles.fullProfile}>
      <Header></Header>
      <div className={Styles.upperProfileContainer}>
        <div className={Styles.upperProfile}>
          <img className={Styles.profileImg} src={userAvatar} />
          <div className={Styles.desc}>
            <h1>{username}</h1>
            <a>{pronouns}</a>
            <textarea placeholder={userDesc}></textarea>
          </div>
          <div onClick={AddToContacts}>Add to contacts!</div>
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
