import React from "react";
import Styles from "../css/meow.module.css";
import { Link } from "react-router-dom";

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
    </div>
  );
}
