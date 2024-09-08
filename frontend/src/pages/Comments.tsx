import React from "react";
import Styles from "../css/Comments.module.css";
import { Link } from "react-router-dom";
const Frog = "/static/images/svFROG.svg";

export default function Comments({ user, text, userAvatar }: {
  user: any,
  text: string,
  userAvatar: string
}) {
  return (
    <div className={Styles.commentsContainer}>
      <div className={Styles.userInfo}>
        <img src={userAvatar}></img>
        <Link className={Styles.text} to={`/user/${user.username}`}>
          <a>{user && user.username}</a>
        </Link>
      </div>
      <div className={Styles.text}>{text}</div>
    </div>
  );
}
