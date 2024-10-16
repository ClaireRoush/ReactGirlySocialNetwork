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
    <>
      <div className={Styles.commentWrapper}>
        <section className={Styles.userInfo}>
          <div className={Styles.avatarWrapper}>
            <img className={Styles.avatar} src={userAvatar} />
          </div>
          <div className={Styles.mainWrapper}>
            <div className={Styles.userWrapper}>
              <div className={Styles.username}>{user}</div>
              {isAuthor ? <div>X</div> : <div></div>}
            </div>
            <a>{text}</a>
          </div>
        </section>
      </div>
    </>
  );
}
