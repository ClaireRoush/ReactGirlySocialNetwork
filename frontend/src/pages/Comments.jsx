import React from "react";
import Styles from "../css/Comments.module.css";

export default function Comments({ user, text }) {
  return (
    <div className={Styles.commentsContainer}>
      {/* Какого хуя это вообще теперь сработало... я заебалась... */}
      <div>{user && user.username}</div>
      <div>{text}</div>
    </div>
  );
}
