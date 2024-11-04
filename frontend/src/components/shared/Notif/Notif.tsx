import React from "react";
import Styles from "./Notif.module.css";
import { Link } from "react-router-dom";
export function Notif({ userAvatar, postUser, likedOn, commentedOn }:
  {
    userAvatar: string,
    postUser: string,
    likedOn: boolean,
    commentedOn: boolean
  }
) {
  return (
    <div className={Styles.notificationContainer}>
      <section className={Styles.userInfo}>
        <img className={Styles.userAvatar} src={userAvatar}></img>
        <Link to={`/user/${postUser}`} className={Styles.link}>
          {postUser}
        </Link>
      </section>

      <section className={Styles.postInfo}>
        {likedOn && <>liked your cutest post!!</>}
        {commentedOn && <>commented your cutest post!!</>}
      </section>
    </div>
  );
}
