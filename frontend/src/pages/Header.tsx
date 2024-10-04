import React, { useContext, useEffect, useState, useRef } from "react";
import Styles from "../css/Header.module.css";
import { UserContext } from "../usercontext";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

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
      fetch(
        process.env.REACT_APP_API_URL + `/profile`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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
      let data: any;
      let result = fetch(
        process.env.REACT_APP_API_URL + `/findUserAvatar/${username}`
      ).then((response) => {
        if (response.status == 404)
          {
            throw new Error("User avatar not found");
          }
          else if (response.status != 200)
          {
            throw new Error("Failed to fetch user profile");
          }
        response.json().then((data) => {
          setUserAvatar(data);
        }).catch((error) => {
          console.error("Error fetching user profile:", error);
        });
      }).catch((error: Error) => {
        console.log("Failed to retrieve user avatar. Using default. Error text:\n", error);
        setUserAvatar(process.env.REACT_APP_STATIC_URL + "/images/default_user_avatar.png");
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
            <Link className={Styles.links} to="/create">
              <a>Create Post</a>
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
            <a>{userInfo.username}</a>
          </Link>
          <img src={userAvatar}></img>
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
