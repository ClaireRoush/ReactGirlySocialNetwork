import React, { useContext, useEffect, useState, useRef } from "react";
import Styles from "../css/Header.module.css";
import { UserContext } from "../usercontext";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
const api = process.env.REACT_APP_API_URL;
const upload = process.env.REACT_APP_UPLOAD;

const Frog = process.env.REACT_APP_STATIC_URL + "/images/svFROG.svg";
const menuSvg = process.env.REACT_APP_STATIC_URL + "/images/menu.svg";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [navOpen, setNavOpen] = useState(false);

  let menuRef: any = useRef(); // TODO: more junk

  useEffect(() => {
    const handler = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setNavOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userInfo) {
      fetch(`${api}/profile`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch user profile");
          }
        })
        .then((userInfo) => {
          setUserInfo(userInfo);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [userInfo, setUserInfo]);

  const username = userInfo?.username;
  useEffect(() => {
    if (username) {
      fetch(`${api}/findUserAvatar/${username}`).then((response) => {
        response.json().then((userAvatar) => {
          setUserAvatar(userAvatar);
        });
      });
    }
  }, [username]);

  return (
    <div className={Styles.header}>
      <div className={Styles.headerContainer}>
        <div className={Styles.logo}>
          <img src={Frog} alt="RGSN"></img>
        </div>
        <div className={Styles.leftistElements}>
          <Link className={Styles.links} to="/">
            <a>Home</a>
          </Link>
          <>
            <Link className={Styles.links} to="/chat">
              <a>Messages</a>
            </Link>
            <Link className={Styles.links} to="/about">
              <a>About us</a>
            </Link>
          </>
          {!username && (
            <div className={Styles.headerContainer}>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
        <section className={Styles.rightistElements}>
          <img src={menuSvg} onClick={() => setNavOpen(!navOpen)}></img>
          <Link to={`/me`}>
          </Link>
          <img src={`${upload}/${userAvatar}`}></img>
        </section>

        <Navbar
          ref={menuRef}
          navOpen={navOpen}
          username={userInfo.username}
          userAvatar={userAvatar}
        />
      </div>
    </div>
  );
}
