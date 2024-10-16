import React, { useEffect, useState } from "react";
import Styles from "../css/Comments.module.css";
import { Link } from "react-router-dom";
const Frog = process.env.REACT_APP_STATIC_URL + "/images/svFROG.svg";

export default function Comments({
  user,
  text,
  userAvatar,
}: {
  user: any;
  text: string;
  userAvatar: string;
}) {
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const checkIsAuthor = async () => {
      setIsAuthor(
        user === JSON.parse(localStorage.getItem("userInfo")).username
      );
    };
    checkIsAuthor();
  }, [user]);

  return (
    <div>
      <section className={Styles.commentsContainer}>
        <div className={Styles.allComment}>
          <section className={Styles.userInfo}>
            <img src={userAvatar}></img>
            <div>
              <div className={Styles.userPlusDelete}>
                <section className={Styles.user}>{user}</section>
                <section>Delete</section>
              </div>
              <div className={Styles.text}>{text}</div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
