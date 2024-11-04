import React, { useEffect, useState, useContext, MouseEvent } from "react";
import Styles from "../css/UserProfile.module.css";
import { UserContext } from "../usercontext";
import Post from "./Post";
import { useParams, Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Header from "./Header";

const POST_PER_REQUEST = 5;
const addFriend = process.env.REACT_APP_STATIC_URL + "/images/add_friend.svg";
const friendStatus = process.env.REACT_APP_STATIC_URL + "/images/friend_status.svg";

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
  const upload = process.env.REACT_APP_UPLOAD_URL;
  const token = localStorage.getItem("token");
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);
  const [friendsCheck, setFriendsCheck] = useState<boolean>(false);

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

  useEffect(() => {
    if (username) {
      FetchPosts();
    }
  }, [visiblePosts, username]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    if (username === userInfo?.username) {
      setRedirect(true);
    }
  }, [username, userInfo]);

  async function FetchPosts() {
    if (noMorePosts) {
      return;
    }
    try {
      const response = await fetch(
        `${api}/post?limit=${POST_PER_REQUEST}&offset=${
          visiblePosts - POST_PER_REQUEST
        }&username=${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length < POST_PER_REQUEST) {
          setNoMorePosts(true);
        }

        if (data.length === 0) {
          setNoMorePosts(true);
          return;
        }

        if (JSON.stringify(data) !== JSON.stringify(posts)) {
          setPosts([...posts, ...data]);
        }
      }
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    }
  }
  
  const loadMorePosts = () => {
    if (noMorePosts) {
      return;
    }
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 5);
  };

  const handleScroll = () => {
    const { innerHeight, scrollY } = window;
    const { scrollHeight } = document.documentElement;

    console.log(noMorePosts);
    console.log(Math.abs(scrollHeight - (scrollY + innerHeight)));

    if (Math.abs(scrollHeight - (scrollY + innerHeight)) < 100) {
      loadMorePosts();
    }
  };

  async function addToContacts(ev: MouseEvent) {
    setFriendsCheck(true)
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
    addToContacts(ev)
      .then(() => {})
      .catch(() => {});
  }

  if (redirect) {
    return <Navigate to={"/me"} />;
  }

  return (
    <div className={Styles.fullProfile}>
      <Header color={"#a6e3a1"} />
      <div className={Styles.upperProfileContainer}>
        <div className={Styles.upperProfile}>
          <img className={Styles.profileImg} src={`${upload}/${userAvatar}`} />
          <div className={Styles.desc}>
            <h1>{username}</h1>
            <a>{pronouns}</a>
            <textarea readOnly value={userDesc}></textarea>
          </div>
          {token ? (
            <section onClick={addToContacts} className={Styles.actionsWrapper}>
              {friendsCheck ? (<img src={friendStatus} className={Styles.addFriend}/>) : (
                <img src={addFriend} className={Styles.addFriend} title="Add to friends" />
                )}
            </section>
          ) : null}
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
