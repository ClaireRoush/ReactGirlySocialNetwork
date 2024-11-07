import React, { FormEvent, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Quill.css";
import { Navigate } from "react-router-dom";
import Styles from "./CreatePost.module.css";
import Header from "../../shared/Header";

const attach = process.env.REACT_APP_STATIC_URL + "/images/attach_icon.svg";
const api = process.env.REACT_APP_API_URL;
const post = process.env.REACT_APP_STATIC_URL + "/images/post_button.svg";

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

export function CreatePost({
  updatePosts,
}: {
  updatePosts: (post_data: any) => void;
}) {
  const [content, setContent] = useState<string>("");
  const [redirect, setRedirect] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
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
      setFileName("")
    }
  }
  
  useEffect(() => {
    if (files && files.length > 0) {
      setFileName(files[0].name);
    }
  }, [files]);


  return (
    <div>
      <Header color={"#a6e3a1"} />
      <div className={Styles.wrapper}>
        <form onSubmit={createNewPost} className={Styles.quillContainer}>
          <section className={Styles.header}>
            <a>wanna post something? :3</a>
          </section>
          <section className={Styles.attachWrapper}>
            <div className={Styles.fileName}>{fileName}</div>
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
          <section className={Styles.postWrapper}>
            <img src={post} className={Styles.post_img}></img>
            <button className={Styles.post_button} type="submit">
              Post
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}
