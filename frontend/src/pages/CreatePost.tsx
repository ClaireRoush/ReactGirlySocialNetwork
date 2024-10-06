import React, { FormEvent, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/Quill.css";
import { Navigate } from "react-router-dom";
import Styles from "../css/CreatePost.module.css";
import Header from "./Header.jsx";
const api = process.env.REACT_APP_API_URL;

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

export default function CreatePost({ updatePosts }) {
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [files, setFiles] = useState("");

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch(`${api}/post`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    updatePosts();
  }

  return (
    <div>
      <Header />
      <div className={Styles.wrapper}>
        <form onSubmit={createNewPost} className={Styles.quillContainer}>
          <section className={Styles.header}>
            <a>Wanna post something? :3</a>
            <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
          </section>

          <ReactQuill
            value={content}
            modules={modules}
            onChange={setContent}
            className={Styles.quill}
          />
          <button className={Styles.postButton}>Post</button>
        </form>
      </div>
    </div>
  );
}
