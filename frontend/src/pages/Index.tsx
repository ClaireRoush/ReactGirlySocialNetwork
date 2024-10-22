import React, { useEffect, useState } from "react";
import Post from "./Post";
import Styles from "../css/Index.module.css";
import Header from "./Header";
import CreatePost from "./CreatePost";
const api = process.env.REACT_APP_API_URL;
const POST_PER_REQUEST = 5;

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [visiblePosts, setVisiblePosts] = useState(5);
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [postsOffset, setPostsOffset] = useState(0);

  async function FetchPosts() {
    if (noMorePosts || loadingPosts) {
      return;
    }
    setLoadingPosts(true);
    try {
      const response = await fetch(
        `${api}/post?limit=${POST_PER_REQUEST}&offset=${
          visiblePosts - POST_PER_REQUEST + postsOffset
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
        }
      );
      if (response.ok) {
        const data = await response.json();

        if (data.length === 0) {
          setNoMorePosts(true);
          setLoadingPosts(false);
          return;
        }

        if (JSON.stringify(data) !== JSON.stringify(posts)) {
          setPosts([...posts, ...data]);
          setLoadingPosts(false);
        }
      }
    } catch (error) {
      console.error("Ошибка при получении постов:", error);
    } finally {
      setLoadingPosts(false);
    }
  }

  async function addUserPostFromData(data: any) {
    let newData = { ...data, isLiked: false, likeCount: 0, commentsCount: 0 };
    setPosts((prevPosts) => [newData, ...prevPosts]);
    setPostsOffset((prevPostsOffset) => prevPostsOffset + 1);
  }

  useEffect(() => {
    FetchPosts();
  }, [visiblePosts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const loadMorePosts = () => {
    if (noMorePosts) {
      return;
    }
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + POST_PER_REQUEST);
  };

  const handleScroll = (e: Event) => {
    const { innerHeight, scrollY } = window;
    const { scrollHeight } = document.documentElement;

    if (Math.abs(scrollHeight - (scrollY + innerHeight)) < 100) {
      loadMorePosts();
    }
  };

  const handlePostDelete = async (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
  };

  const mainColor = "#a6e3a1";

  return (
    <div className="">
      <Header color={"#a6e3a1"} />
      {token ? (
        <div className={Styles.createPost}>
          <CreatePost updatePosts={addUserPostFromData}></CreatePost>
        </div>
      ) : null}

      <div className={Styles.UserProfile}>
        <div className={Styles.postContainer}>
          <div className={Styles.post}>
            {posts.length > 0 &&
              posts.map((post) => (
                <Post
                  key={post._id}
                  {...post}
                  onDelete={handlePostDelete}
                  color={mainColor}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
