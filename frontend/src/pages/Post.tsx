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
}: {
  image: string;
  content: string;
  author: any; // TODO: this is junky
  _id: string;
  color: string;
  isLiked: boolean;
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
  const [isLikedState, setIsLikedState] = useState(isLiked);

  useEffect(() => {
    const getLikes = async () => {
      const response = await fetch(
        process.env.REACT_APP_API_URL + `/post/likes/${_id}`
      );
      if (response.ok) {
        const likesData = await response.json();
        setLikes(likesData.likeCount);
      }
    };
    getLikes();
  }, [_id]);

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

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + `/findUserAvatar/${author.username}`)
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
    const response = await fetch(
      process.env.REACT_APP_API_URL + `/post/likes/${_id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const likesData = await response.json();
      setLikes(likesData.likeCount);
      setIsLikedState(!isLikedState);
    }
  }

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + `/post/comments/${_id}`)
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
  }, [setComments]);

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
          {comments.map((comment) => (
            <Comments
              key={comment._id}
              user={comment.user}
              text={comment.text}
              userAvatar={comment.user.userAvatar}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
