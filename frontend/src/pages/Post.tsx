import React, { useEffect, useState, useRef, MouseEvent, FormEvent } from "react";
import Styles from "../css/meow.module.css";
import { Link, Navigate, redirect } from "react-router-dom";
import Comments from "./Comments";
const commentSvg = process.env.REACT_APP_STATIC_URL + "/images/comment.svg";
const likeSvg = process.env.REACT_APP_STATIC_URL + "/images/like.svg";
const chromiumSvg = process.env.REACT_APP_STATIC_URL + "/images/chromium.svg";
const Frog = process.env.REACT_APP_STATIC_URL + "/images/svFROG.svg";
const frogLike = process.env.REACT_APP_STATIC_URL + "/images/frogLike.svg";
const api = process.env.REACT_APP_API_URL;
const upload = process.env.REACT_APP_UPLOAD;

export default function Post({ image, content, author, _id, color }: {
  image: string;
  content: string;
  author: any;  // TODO: this is junky
  _id: string;
  color: string;
}) {
  const [isAuthor, setIsAuthor] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const token = localStorage.getItem("token");
  const commentsContainerRef = useRef(null);
  const commentsButtonRef = useRef(null);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState("");
  const [existingLike, setExistingLike] = useState(null);

  const checkLikes = async () => {
    try {
      const response = await fetch(`${api}/checkIfLiked/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setExistingLike(data);
      }
    } catch (error) {
      console.log("Не мяу :<");
    }
  };

  useEffect(() => {
    checkLikes();
  }, [_id, token]);

  useEffect(() => {
    const getLikes = async () => {
==== BASE ====
      const response = await fetch(
        `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/post/likes/${_id}`
      );
==== BASE ====
      if (response.ok) {
        const likesData = await response.json();
        setLikes(likesData.likeCount);
      }
    };
    getLikes();
  }, [_id]);

  useEffect(() => {
    const checkIsAuthor = async () => {
==== BASE ====
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
==== BASE ====
      if (response.ok) {
        const data = await response.json();
        setIsAuthor(data);
      }
    };
    checkIsAuthor();
  }, [_id, token]);

  useEffect(() => {
==== BASE ====
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/findUserAvatar/${author.username}`
    )
==== BASE ====
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((userAvatar) => {
        setUserAvatar(userAvatar);
      });
  }, [author.username, setUserAvatar]);

  async function postLike(ev: MouseEvent) {
    ev.preventDefault();
==== BASE ====
    const response = await fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/post/likes/${_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
==== BASE ====
    if (response.ok) {
      const likesData = await response.json();
      setLikes(likesData.likeCount);
      checkLikes();
    }
  }

  useEffect(() => {
==== BASE ====
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/post/comments/${_id}`
    )
==== BASE ====
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to find comments");
        }
      })
      .then((comments) => {
        setComments(comments);
      });
  }, [_id, setComments]);

  async function postComment(ev: FormEvent) {
    ev.preventDefault();
==== BASE ====
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
==== BASE ====
    if (response.ok) {
      const newComment = await response.json();
      setComments([...comments, newComment]);
    }
  }

  const deletePost = async () => {
==== BASE ====
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
==== BASE ====
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

  const toggleLikes = (ev: MouseEvent) => {
    postLike(ev);
  };

  if (redirect) {
    return <Navigate to={"/meow"} />;
  }

  const handleClick = (event: MouseEvent) => {
    if (event.currentTarget === event.target) {
      setRedirect(false);
    }
  };

  return (
    <div
      className={Styles.post}
      style={{ border: `4px solid ${color}` }}
      onClick={handleClick}
    >
      <div className={Styles.info} onClick={handleClick}>
        <div className={Styles.author} onClick={handleClick}>
          <img src={`${upload}/${userAvatar}`} alt=""></img>
          <Link to={`/user/${author.username}`}>
            <a>{author.username}</a>
          </Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
      <div className={Styles.image}>
        {image.startsWith("http") ? (
          <img src={image} alt="" />
        ) : (
          <img src={`${upload}/${image}`} alt="" />
        )}
      </div>

      <section className={Styles.postActions}>
        <section>
          <div className={Styles.actionsContainer}>
            <div className={Styles.iHateMyselfContainer}>
              <div className={Styles.likes}>
                <div className={Styles.likes}>
                  <a>{likes}</a>
                  {existingLike ? (
                    <img src={frogLike} onClick={toggleLikes} />
                  ) : (
                    <img src={likeSvg} onClick={toggleLikes} />
                  )}
                </div>
              </div>
              <div className={Styles.comment}>
                <a>{comments.length}</a>
                <img
                  src={commentSvg}
                  className={Styles.comment}
                  onClick={toggleComments}
                  ref={commentsButtonRef}
                />
              </div>
            </div>
            <div className={Styles.chromiumContainer}>
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
        </section>
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
              userAvatar={`${upload}/${comment.user.userAvatar}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}