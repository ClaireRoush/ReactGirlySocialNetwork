import React, {
  useEffect,
  useState,
  useRef,
  MouseEvent,
  FormEvent,
} from "react";
import Styles from "../css/meow.module.css";
import { Link, Navigate } from "react-router-dom";
import Comments from "./Comments";
const commentSvg = process.env.REACT_APP_STATIC_URL + "/images/comment.svg";
const likeSvg = process.env.REACT_APP_STATIC_URL + "/images/like.svg";
const chromiumSvg = process.env.REACT_APP_STATIC_URL + "/images/chromium.svg";
const Frog = process.env.REACT_APP_STATIC_URL + "/images/svFROG.svg";
const frogLike = process.env.REACT_APP_STATIC_URL + "/images/frogLike.svg";
const uploadURL = process.env.REACT_APP_UPLOAD_URL;

export default function Post({
  image,
  content,
  author,
  _id,
  color,
  isLiked,
  likeCount,
  userComments,
}: {
  image: string;
  content: string;
  author: any; // TODO: this is junky
  _id: string;
  color: string;
  isLiked: boolean;
  likeCount: number;
  userComments: any[];
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
  const [likes, setLikes] = useState(likeCount);
  const [isLikedState, setIsLikedState] = useState(isLiked);

  useEffect(() => {
    const checkIsAuthor = async () => {
      setIsAuthor(
        author.username ===
          JSON.parse(localStorage.getItem("userInfo")).username
      );
      // TODO: maybe save username in localStorage?
      // Isn't it be always in localStorage???
    };
    checkIsAuthor();
  }, [_id, token]);

  const postLike = async (ev: MouseEvent) => {
    setIsLikedState((prevIsLiked) => {
      if (prevIsLiked) {
        setLikes((prevLikeCount) => prevLikeCount - 1);
      } else {
        setLikes((prevLikeCount) => prevLikeCount + 1);
      }
      return !prevIsLiked;
    });

    ev.preventDefault();
    fetch(process.env.REACT_APP_API_URL + `/post/likes/${_id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  async function postComment(ev: FormEvent) {
    ev.preventDefault();
    const response = await fetch(
      process.env.REACT_APP_API_URL + `/post/comments/${_id}`,
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
      process.env.REACT_APP_API_URL + `/post/${_id}`,
      {
        method: "delete",
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

  const toggleLikes = (ev: MouseEvent) => {
    postLike(ev);
  };

  if (redirect) {
    return <Navigate to={"/meow"} />;
  }

  useEffect(() => {
    setComments(userComments);
  }, [userComments]);

  const handleClick = (event: MouseEvent) => {
    if (event.currentTarget === event.target) {
      setRedirect(true);
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
          <img src={userAvatar} alt="User Avatar"></img>
          <Link to={`/user/${author.username}`}>
            <a>{author.username}</a>
          </Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
      <div className={Styles.image}>
        <img src={image} alt=""></img>
        <img src={`${uploadURL}/${image}`} alt=""></img>
      </div>

      <section className={Styles.postActions}>
        <section>
          <div className={Styles.actionsContainer}>
            <div className={Styles.iHateMyselfContainer}>
              <div className={Styles.likes}>
                <div className={Styles.likes}>
                  <a>{likes}</a>
                  {isLikedState ? (
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
          {userComments.length > 0 ? (
            userComments.map((comment) => (
              <Comments
                key={comment._id}
                user={comment.user.username}
                text={comment.text}
                userAvatar={comment.user.userAvatar || "/default-avatar.png"}
              />
            ))
          ) : (
            <p>No comments yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
