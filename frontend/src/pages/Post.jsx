import React, { useEffect, useState, useRef } from "react";
import Styles from "../css/meow.module.css";
import { Link /* useNavigate */ } from "react-router-dom";
import commentSvg from "../svg/comment.svg";
import likeSvg from "../svg/like.svg";
import chromiumSvg from "../svg/chromium.svg";

import Comments from "../pages/Comments";
export default function Post({
  /*   title,
  summary,
  createdAt, */
  image,
  content,
  author,
  _id,
  color,
}) {
  const [isAuthor, setIsAuthor] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const token = localStorage.getItem("token");
  const commentsContainerRef = useRef(null);
  const commentsButtonRef = useRef(null);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const checkIsAuthor = async () => {
      const response = await fetch(
        `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/isMyPost/${_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIsAuthor(data);
      }
    };
    checkIsAuthor();
  }, [_id, token]);

  useEffect(() => {
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/findUserAvatar/${author.username}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((userAvatar) => {
        setUserAvatar(userAvatar);
      });
  }, [author.username, setUserAvatar]);

  useEffect(() => {
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/post/comments/${_id}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
          setComments([...comments]);
        } else {
          throw new Error("Failed to find comments");
        }
      })
      .then((comments) => {
        setComments(comments);
      });
  }, [setComments]);

  async function postComment(ev) {
    ev.preventDefault();
    const response = await fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/post/comments/${_id}`,
      {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const newComment = await response.json();
      setComments([...comments, newComment]);
    }
  }

  const deletePost = async () => {
    const response = await fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/deletePost/${_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      setIsDeleted(true);
    }
  };

  if (isDeleted) {
    return null;
  }

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const likesAlert = () => {
    alert("under construction");
  };

  const likes = 0;
  return (
    <div className={Styles.post} style={{ border: `4px solid ${color}` }}>
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

      <section className={Styles.postActions}>
        <div className={Styles.postBtn}>
          {likes}
          <div className={Styles.likes}>
            <img src={likeSvg} onClick={likesAlert}></img>
          </div>
          <div>{comments.length}</div>
          <div className={Styles.commentSvg}>
            <img
              src={commentSvg}
              className={Styles.comment}
              onClick={toggleComments}
              ref={commentsButtonRef}
            ></img>
          </div>
          <div>
            {isAuthor && (
              <>
                <img
                  className={Styles.chromium}
                  src={chromiumSvg}
                  onClick={deletePost}
                />
              </>
            )}
          </div>
        </div>
        <div
          className={Styles.commentContainer}
          ref={commentsContainerRef}
          style={{ display: showComments ? "flex" : "none" }}
        >
          <form onSubmit={postComment}>
            <input
              className={Styles.postInput}
              type="text"
              placeholder="Your comment"
              value={text}
              onChange={(ev) => setText(ev.target.value)}
            ></input>
            <button>Post!!!</button>
          </form>
          {comments.map((comment) => (
            <Comments
              key={comment._id}
              user={comment.user}
              text={comment.text}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
