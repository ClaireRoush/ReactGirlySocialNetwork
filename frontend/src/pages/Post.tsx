import React, {
  useEffect,
  useState,
  useRef,
  MouseEvent,
  FormEvent,
} from "react";
import Styles from "../css/Post.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/Quill.css";
import { Link, Navigate } from "react-router-dom";
import Comments from "./Comments";
const commentSvg = process.env.REACT_APP_STATIC_URL + "/images/comment.svg";
const likeSvg = process.env.REACT_APP_STATIC_URL + "/images/like.svg";
const chromiumSvg = process.env.REACT_APP_STATIC_URL + "/images/chromium.svg";
const frogEdit = process.env.REACT_APP_STATIC_URL + "/images/edit.svg";
const frogLike = process.env.REACT_APP_STATIC_URL + "/images/frogLike.svg";
const contextDots =
  process.env.REACT_APP_STATIC_URL + "/images/contextDots.svg";
const copySvg = process.env.REACT_APP_STATIC_URL + "/images/copy.svg";

const uploadURL = process.env.REACT_APP_UPLOAD_URL;
const api = process.env.REACT_APP_API_URL;
const url = process.env.REACT_APP_URL;
const staticUrl = process.env.REACT_APP_STATIC_URL;
const onImageErrorImage = staticUrl + "/images/image_no_load_small.gif";

const insertLinksToText = (text: string) => {
  const regex = RegExp("https?:\\/\\/.*\.[a-zA-Z]*", "g")
  const urls = regex.exec(text)

  if (!urls) {
    return text
  }

  let newText = text
  urls.forEach((url) => {
    newText = text.replace(url, `<a href="${url}">${url}</a>`)
  })
  
  return newText  
}

export default function Post({
  image,
  content: forUpdated,
  author,
  _id,
  color,
  isLiked,
  likeCount,
  commentsCount,
  onDelete = () => {},
}: {
  image: string;
  content: string;
  author: any; // TODO: this is junky
  _id: string;
  color: string;
  isLiked: boolean;
  likeCount: number;
  commentsCount: number;
  onDelete?: (postId: string) => void;
}) {
  const id = _id;
  const [isAuthor, setIsAuthor] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [redirect, setRedirect] = useState(false);
  const token = localStorage.getItem("token");
  const commentsContainerRef = useRef(null);
  const commentsButtonRef = useRef(null);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(likeCount);
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [commentsCountState, setCommentsCountState] = useState(commentsCount);
  const [isEdited, setIsEdited] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [content, setContent] = useState(insertLinksToText(forUpdated));
  const [updatedContent, setUpdatedContent] = useState<string>("");
  const [contextOpen, setContextOpen] = useState(false);
  const [marginRight, setMarginRight] = useState(140);

  const modules = {
    toolbar: [
      [{ header: [1, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
  };

  useEffect(() => {
    if (token) {
      const checkIsAuthor = async () => {
        setIsAuthor(
          author.username ===
            JSON.parse(localStorage.getItem("userInfo")).username
        );
      };
      // TODO: maybe save username in localStorage?
      // Isn't it be always in localStorage???
      checkIsAuthor();
    }
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
      setCommentsCountState((prevCount) => prevCount + 1);
    }
  }

  const updateCommentCount = async () => {
    setCommentsCountState((prevCount) => prevCount - 1);
  };

  const contextMenuOpen = async () => {
    setContextOpen(true);
    setMarginRight(marginRight === 140 ? 500 : 140);
    if (contextOpen) {
      setContextOpen(false);
    }
  };

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
      onDelete(_id);
    }
  };

  async function updatePost(ev: FormEvent) {
    ev.preventDefault();

    const data = {
      content: updatedContent,
    };

    const response = await fetch(`${api}/post/edit/${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setContent(updatedContent);
    } else {
      console.error("Error during post update:", response.statusText);
    }
  }

  async function getComments() {
    try {
      if (!showComments && comments.length === 0) {
        const requestComments = await fetch(
          process.env.REACT_APP_API_URL + `/post/comments/${_id}`
        );
        if (requestComments.ok) {
          const data = await requestComments.json();
          setComments(data);
        }
      }
      setShowComments(!showComments);
    } catch (error) {
      console.error("So silly!!!! Very silly!!!");
    }
  }

  const toggleLikes = token
    ? (ev: MouseEvent) => {
        postLike(ev);
      }
    : () => {}; // i fucking hate that

  const handleClick = (event: MouseEvent) => {
    if (event.currentTarget === event.target) {
      setRedirect(false);
    }
  };

  async function edit() {
    setIsEdited(true);
    if (isEdited) {
      setIsEdited(false);
    }
  }

  return (
    <div className={Styles.post} onClick={handleClick}>
      <div className={Styles.info} onClick={handleClick}>
        <div className={Styles.authorWrapper} onClick={handleClick}>
          <section className={Styles.author}>
            <img
              src={`${uploadURL}/${author.userAvatar}`}
              alt="User Avatar"
            ></img>
            <Link to={`/user/${author.username}`}>
              <a>{author.username}</a>
            </Link>
          </section>
          <section className={Styles.contextMenu}>
            <div
              className={Styles.closedMenu}
              style={{ marginRight: `${marginRight}px` }}
            ></div>
            <div
              className={Styles.contextItem}
              onClick={() => {
                navigator.clipboard.writeText(
                  `${url}/${author.username}/${_id}`
                );
              }}
            >
              <img src={copySvg} />
            </div>
            <div className={Styles.openMenu}>
              <div className={Styles.contextItem} onClick={edit}>
                {isAuthor && <img className={Styles.edit} src={frogEdit} />}
              </div>
              <div className={Styles.contextItem} onClick={deletePost}>
                {isAuthor && <img src={chromiumSvg} />}
              </div>
            </div>
            <img src={contextDots} onClick={contextMenuOpen}></img>
          </section>
        </div>
        {isEdited ? (
          <div className={Styles.editWrapper}>
            <form onSubmit={updatePost}>
              <ReactQuill
                value={updatedContent}
                onChange={(value) => {
                  console.log("Updated content: ", value);
                  setUpdatedContent(value);
                }}
                modules={modules}
                className={Styles.quill}
              />
              <section className={Styles.editInputsWrapper}>
                <button className={Styles.postButton} type="submit">
                  Post
                </button>
              </section>
            </form>
          </div>
        ) : (
          <>
            <section className={Styles.content} dangerouslySetInnerHTML={{ __html: content }}></section>
            <section className={Styles.image}>
              {
                image &&
                <img src={`${uploadURL}/${image}`} onError={(ev) => {
                  ev.currentTarget.src = onImageErrorImage
                }}/>
              }
            </section>
          </>
        )}
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
                <a>{commentsCountState}</a>
                <img
                  src={commentSvg}
                  className={Styles.comment}
                  onClick={getComments}
                  ref={commentsButtonRef}
                />
              </div>
            </div>
          </div>
        </section>
        <div
          className={Styles.commentContainer}
          ref={commentsContainerRef}
          style={{ display: showComments ? "flex" : "none" }}
        >
          {token ? (
            <form onSubmit={postComment}>
              <input
                className={Styles.postInput}
                type="text"
                placeholder="your comment"
                value={text}
                onChange={(ev) => setText(ev.target.value)}
              ></input>
              <button>Post!!!</button>
            </form>
          ) : null}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comments
                commentId={comment._id}
                user={comment.user.username}
                text={comment.text}
                userAvatar={comment.user.userAvatar}
                commentState={updateCommentCount}
              />
            ))
          ) : (
            <p>no comments yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
