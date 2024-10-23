import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Post from "./Post";
import Styles from "../css/FullPost.module.css";

interface PostData {
  image: string;
  content: string;
  author: any;
  _id: string;
  color: string;
  isLiked: boolean;
  likeCount: number;
  commentsCount: number;
}

export default function () {
  const [post, setPost] = useState<PostData | null>(null);
  const api = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const { id } = useParams();

  async function FetchPosts() {
    const response = await fetch(`${api}/post/find/${id}`, {
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
      setPost(data);
    }
  }

  useEffect(() => {
    FetchPosts();
  }, [id]);

  return (
    <div>
      <Header color={"#a6e3a1"} />
      <section className={Styles.postWrapper}>
        <div className={Styles.post}>
          {post ? <Post {...post} /> : <p>Loading post...</p>}
        </div>
      </section>
    </div>
  );
}
