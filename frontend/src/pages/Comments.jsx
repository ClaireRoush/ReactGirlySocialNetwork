import React from "react";
import Styles from "../css/Comments.module.css";
import Frog from "../svg/svFROG.svg";
import { Link } from "react-router-dom";

export default function Comments({ user, text, userAvatar }) {
  return (
    <div className={Styles.commentsContainer}>
      <div className={Styles.userInfo}>
        <img src={userAvatar}></img>
        <Link className={Styles.text} to={`/user/${user.username}`}>
          <a>{user.username}</a>
        </Link>
      </div>
      <div className={Styles.text}>{text}</div>
    </div>
  );
}
