import React from "react";
import Styles from "../css/Notif.module.css";
import { Link } from "react-router-dom";
function Notif({ userAvatar, postUser, likedOn, commentedOn }) {
  return (
    <div className={Styles.notificationContainer}>
      <section className={Styles.userInfo}>
        <img className={Styles.userAvatar} src={userAvatar}></img>
        <Link to={`/user/${postUser}`} className={Styles.link}>
          {postUser}
        </Link>
      </section>

      <section className={Styles.postInfo}>
        {likedOn && <>Liked your cutest post!!</>}
        {commentedOn && <>Commented your cutest post!!</>}
      </section>
    </div>
  );
}

export default Notif;
