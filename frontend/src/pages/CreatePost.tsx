import React, { FormEvent, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../css/Quill.css";
import { Navigate } from "react-router-dom";
import Styles from "../css/CreatePost.module.css";
import Header from "./Header";
const attach = process.env.REACT_APP_STATIC_URL + "/images/attach_icon.svg";
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

export default function CreatePost({
  updatePosts,
}: {
  updatePosts: (post_data: any) => void;
}) {
  const [content, setContent] = useState<string>("");
  const [redirect, setRedirect] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | null>(null);

  async function createNewPost(ev: FormEvent) {
    const data = new FormData();
    data.set("content", content);
    if (files) {
      data.set("file", files[0]);
    }
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
      updatePosts((await response.json()).postDoc);
    }
  }

  return (
    <div>
      <Header />
      <div className={Styles.wrapper}>
        <form onSubmit={createNewPost} className={Styles.quillContainer}>
          <section className={Styles.header}>
            <a>Wanna post something? :3</a>
          </section>
          <section className={Styles.attachWrapper}>
            <img src={attach} className={Styles.attach_img}></img>
            <input
              type="file"
              onChange={(ev) => setFiles(ev.target.files)}
              className={Styles.attach_button}
            ></input>
          </section>
          <ReactQuill
            value={content}
            modules={modules}
            onChange={setContent}
            className={Styles.quill}
          />
          <button className={Styles.postButton} type="submit">
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
