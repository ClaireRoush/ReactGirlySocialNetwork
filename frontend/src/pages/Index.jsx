import React, { useEffect, useState } from "react";
import Post from "./Post";
import Header from "./Header";
import Styles from "../css/Index.module.css";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(
      "https://reactgirlysocialnetwork-backend-dzs8.onrender.com/post"
    ).then((response) => {
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
  }, []);

  return (
    <div className={Styles.UserProfile}>
      <Header />
      {posts.length > 0 &&
        posts
          .slice(0, visiblePosts)
          .map((post) => <Post key={post.id} {...post} />)}
    </div>
  );
}
