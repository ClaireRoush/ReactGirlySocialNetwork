import React, { useEffect, useState } from "react";
import Styles from "../css/meow.module.css";
import { Link, useNavigate } from "react-router-dom";

export default function Post({
  title,
  summary,
  userAvatar,
  image,
  content,
  createdAt,
  author,
  _id,
}) {
  const [isAuthor, setIsAuthor] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkIsAuthor = async () => {
      const response = await fetch(
        `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/isMyPost/${_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIsAuthor(data);
      }
    };
    checkIsAuthor();
  }, [_id, token]);

  const deletePost = async () => {
    const response = await fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/deletePost/${_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      setIsDeleted(true);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className={Styles.post}>
      <div className={Styles.info}>
        <div className={Styles.author}>
          <img src={userAvatar}></img>
          <Link to={`/userProfile/${author.username}`}>
            <a>{author.username}</a>
          </Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
      <div className={Styles.image}>
        <img src={image} alt=""></img>
      </div>
      {isAuthor && (
        <>
          <button onClick={deletePost}>Delete Post</button>
        </>
      )}
    </div>
  );
}
