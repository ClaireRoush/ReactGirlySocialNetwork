import React, { useEffect, useState, useContext, MouseEvent } from "react";
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
  const api = process.env.REACT_APP_API_URL;
  const upload = process.env.REACT_APP_UPLOAD;

  useEffect(() => {
    fetch(`${api}/userProfile/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.username);
        setUserAvatar(data.userAvatar);
        setUserDesc(data.userDesc);
        setPronouns(data.pronouns);
        setprofileHashColor(data.profileHashColor);
      });
  }, [userId]);

  async function AddToContacts(ev: MouseEvent) {
    ev.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch(`${api}/addToContacts/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  }

  function handleAddToContacts(ev: MouseEvent) {
    AddToContacts(ev)
      .then(() => {})
      .catch(() => {});
  }

  useEffect(() => {
    if (username) {
      fetch(`${api}/post/${username}`).then((response) => {
        response.json().then((posts) => {
          setPosts(posts);
        });
      });
    }
  }, [username]);

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
          <img className={Styles.profileImg} src={`${upload}/${userAvatar}`} />
          <div className={Styles.desc}>
            <h1>{username}</h1>
            <a>{pronouns}</a>
            <textarea placeholder={userDesc}></textarea>
          </div>
          <div onClick={handleAddToContacts}>Add to contacts!</div>
        </div>
      </div>
      <div className={Styles.profileInfo}>
        <div className={Styles.profilePosts}>
          {posts.length > 0 &&
            posts.map((post) => <Post key={post.id} {...post} />)}
        </div>
      </div>
    </div>
  );
}
