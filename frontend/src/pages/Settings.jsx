import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../usercontext";
import { Link } from "react-router-dom";
import Styles from "../css/Settings.module.css";
import Header from "../pages/Header.jsx";
<Header />;

export default function Settings() {
  const [userAvatar, setUserAvatar] = useState("");
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [profileHashColor, setProfileHashColor] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setProfileHashColor(inputValue);
    }
  };

  async function changeInfo(ev) {
    ev.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch(
      "https://reactgirlysocialnetwork-backend-dzs8.onrender.com/settings",
      {
        method: "Post",
        body: JSON.stringify({
          userAvatar,
          username,
          userDesc,
          pronouns,
          profileHashColor,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      {
        alert("meow");
      }
    }
  }

  useEffect(() => {
    fetch("https://reactgirlysocialnetwork-backend-dzs8.onrender.com/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json().then((info) => {
          setUsername(info.username);
          setUserAvatar(info.userAvatar);
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
            type="text"
            placeholder="User avatar (url)"
            value={userAvatar}
            onChange={(ev) => setUserAvatar(ev.target.value)}
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
