import React, { useEffect, useState } from "react";
import Post from "./Post";
import Styles from "../css/Index.module.css";
import Header from "../pages/Header.jsx";
import CreatePost from "../pages/CreatePost.jsx";
const api = process.env.REACT_APP_API_URL;

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    fetch(`${api}/post`).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);

  const [visiblePosts, setVisiblePosts] = useState(5);

  const loadMorePosts = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 5);
  };
  const handleScroll = () => {
    const { innerHeight, scrollY } = window;
    const { scrollHeight } = document.documentElement;

    if (Math.abs(scrollHeight - (scrollY + innerHeight)) < 1) {
      loadMorePosts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const mainColor = "#a6e3a1";

  return (
    <div className="">
      <Header />
      <div className={Styles.createPost}>
      <CreatePost></CreatePost>
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
