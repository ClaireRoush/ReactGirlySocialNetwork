import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../usercontext";
import { Link } from "react-router-dom";
import Styles from "../css/Settings.module.css";
import Header from "../pages/Header.jsx";

export default function Settings() {
  const token = localStorage.getItem("token");
  const [files, setFiles] = useState('');
  const [username, setUsername] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [profileHashColor, setProfileHashColor] = useState("");
  const api = process.env.REACT_APP_API_URL;

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setProfileHashColor(inputValue);
    }
  };

  async function changeInfo(ev) {
    const data = new FormData();
    data.set('file', files[0]); 
    data.set("username", username);
    data.set("userDesc", userDesc);
    data.set("pronouns", pronouns);
    data.set("profileHashColor",profileHashColor);
    
    ev.preventDefault();

    const token = localStorage.getItem("token");
    const response = await fetch(`${api}/settings`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (response.ok) {
        alert("meow");
    }
  }

  useEffect(() => {
    fetch(`${api}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json().then((info) => {
          setUsername(info.username);
          setUserDesc(info.userDesc);
          setPronouns(info.pronouns);
          setProfileHashColor(info.profileHashColor);
        });
      }
    });
  }, [token]);

  return (
    <div className={Styles.wrapper}>
      <Header />
      <div className={Styles.textAreas}>
        <form onSubmit={changeInfo}>
          <input
            type="text"
            placeholder="User name"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
          />
          <input
            type="file"
            placeholder="User avatar"
            onChange={ev => setFiles(ev.target.files)}
            />
          <input
            type="text"
            placeholder="User desc."
            value={userDesc}
            onChange={(ev) => setUserDesc(ev.target.value)}
          />
          <input
            type="text"
            placeholder="User pronouns."
            value={pronouns}
            onChange={(ev) => setPronouns(ev.target.value)}
          />

          <button>Save</button>
        </form>
      </div>

      <div className={Styles.colorPicker}>
        <div className={Styles.mainColor}>
          <div
            className={Styles.inputBlock}
            style={{ backgroundColor: profileHashColor }}
          ></div>
          <form>
            <input
              type="text"
              onChange={(ev) => setProfileHashColor(ev.target.value)}
              placeholder="#RRGGBB"
              maxLength={7}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
