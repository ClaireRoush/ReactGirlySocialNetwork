import React, { useEffect, useState } from "react";
import Post from "./Post";
import Styles from "../css/Index.module.css";
import Header from "./Header";
import CreatePost from "./CreatePost";
const api = process.env.REACT_APP_API_URL;
const POST_PER_REQUEST = 5;


export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);

  async function FetchPosts() {
    if (noMorePosts) {
      return;
    }
    try {
      const response = await fetch(`${api}/post?limit=${POST_PER_REQUEST}&offset=${visiblePosts - POST_PER_REQUEST}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.length < POST_PER_REQUEST) {
          setNoMorePosts(true);
        }

        if (data.length === 0) {
          setNoMorePosts(true);
          return
        }

        if (JSON.stringify(data) !== JSON.stringify(posts)) {
          setPosts([...posts, ...data]);
        }
      }
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    }
  }

  useEffect(() => {
    FetchPosts();
  }, [visiblePosts]);


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });


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
    console.log(Math.abs(scrollHeight - (scrollY + innerHeight)))

    if (Math.abs(scrollHeight - (scrollY + innerHeight)) < 100) {
      loadMorePosts();
    }
  };

  const mainColor = "#a6e3a1";

  return (
    <div className="">
      <Header />
      <div className={Styles.createPost}>
        <CreatePost updatePosts={FetchPosts}></CreatePost>
      </div>

      <div className={Styles.UserProfile}>
        <div className={Styles.postContainer}>
          <div className={Styles.post}>
            {posts.length > 0 &&
              posts
                .slice(0, visiblePosts)
                .map((post) => (
                  <Post key={post.id} {...post} color={mainColor} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
