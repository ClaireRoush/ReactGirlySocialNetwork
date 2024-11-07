import React from "react";
import Post from "../Post";
import Styles from "../css/Index.module.css";

export function PostList({
    posts,
    onPostDelete = () => {},
}: {
    posts: any;
    onPostDelete?: (postId: string) => void;
}) {
  const handlePostDelete = async (postId: string) => {
    onPostDelete(postId);
  };

  const mainColor = "#a6e3a1";

  return (
    <>
        <div className={Styles.UserProfile}>
            <div
            className={Styles.postContainer}
            // style={!token ? { marginTop: "90px" } : null}
            >
                <div className={Styles.post}>
                    {posts.length > 0 &&
                    posts.map((post: any) => (
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
    </>
  );
}
