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

  return (
    <div className={Styles.UserProfile}>
      <Header />
      {posts.length > 0 && posts.map((post) => <Post {...post} />)}
    </div>
  );
}
