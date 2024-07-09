import React from "react";
import Styles from "../css/Comments.module.css";

export default function Comments({ user, text }) {
  return (
    <div className={Styles.commentsContainer}>
      <div>{user}</div>
      <div>{text}</div>
    </div>
  );
}
