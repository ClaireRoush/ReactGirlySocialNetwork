import React, { useEffect, useState } from "react";
import Styles from "./Comments.module.css";
import { Link } from "react-router-dom";
const Frog = process.env.REACT_APP_STATIC_URL + "/images/svFROG.svg";

interface CommentsProps {
  user: string;
  text: string;
  userAvatar: string;
  commentId: string;
  commentState: () => Promise<void>;
}

export function Comments({
  user,
  text,
  userAvatar,
  commentId,
  commentState,
}: CommentsProps) {
  const token = localStorage.getItem("token");
  const [isAuthor, setIsAuthor] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const checkIsAuthor = async () => {
      setIsAuthor(
        user === JSON.parse(localStorage.getItem("userInfo")).username
      );
    };
    checkIsAuthor();
  }, [user]);

  const deleteComment = async () => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + `/post/comments/${commentId}`,
      {
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      await commentState();
      setIsDeleted(true);
    }
  };

  if (isDeleted) {
    return null;
  }

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
              {isAuthor ? (
                <div className={Styles.deleteBtn} onClick={deleteComment}>
                  X
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <a>{text}</a>
          </div>
        </section>
      </div>
    </>
  );
}
