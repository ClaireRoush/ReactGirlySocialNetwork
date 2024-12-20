import React, { useEffect, useState, useContext } from "react";
import Styles from "./Me.module.css";
import Header from "../../components/shared/Header";
import Post from "../../components/post/Post";
import { UserContext } from "../../usercontext";

const POST_PER_REQUEST = 5;

export function Me() {
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [posts, setPosts] = useState([]);
  const [pronouns, setPronouns] = useState("");
  const [profileHashColor, setprofileHashColor] = useState("#a6e3a1");
  const token = localStorage.getItem("token");
  const api = process.env.REACT_APP_API_URL;
  const upload = process.env.REACT_APP_UPLOAD_URL;
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);
  const { userInfo, setUserInfo } = useContext(UserContext);

  const userId = username;

  useEffect(() => {
    fetch(`${api}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        return response
          .json()
          .then((info) => {
            setUsername(info.username);
            setUserAvatar(info.userAvatar);
            setUserDesc(info.userDesc);
            setPronouns(info.pronouns);
            setprofileHashColor(info.profileHashColor);
          })
          .catch((error) => {
            console.error("Error fetching user profile:", error);
          });
      }
    });
  }, [token]);

  useEffect(() => {
    if (username) {
      fetch(`${api}/post?username=${username}`).then((response) => {
        response.json().then((posts) => {
          setPosts(posts);
        });
      });
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      FetchPosts();
    }
  }, [visiblePosts, username]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

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

  return (
    <div className={Styles.fullProfile}>
      <Header color={"#a6e3a1"} />

      <div className={Styles.upperProfileContainer}>
        <div className={Styles.upperProfile}>
          <img className={Styles.profileImg} src={`${upload}/${userAvatar}`} />
          <div className={Styles.desc}>
            <h1>{username}</h1>
            <textarea readOnly value={userDesc}></textarea>
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
