import React, { useContext, useEffect, useState, useRef } from "react";
import Styles from "../css/Header.module.css";
import { UserContext } from "../usercontext";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
const api = process.env.REACT_APP_API_URL;
const upload = process.env.REACT_APP_UPLOAD;

const Frog = process.env.REACT_APP_STATIC_URL + "/images/svFROG.svg";
const menuSvg = process.env.REACT_APP_STATIC_URL + "/images/menu.svg";

export default function Header({ color }: { color: string }) {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <div
        className={Styles.headerContainer}
        style={{ borderBottom: `${color} 4px solid` }}
      >
        <div className={Styles.logo}>
          <img src={Frog} alt="RGSN"></img>
        </div>
        {username ? (
          <>
            <div className={Styles.leftistElements}>
              <Link className={Styles.links} to="/">
                <a>Home</a>
              </Link>
              <>
                <Link className={Styles.links} to="/chat">
                  <a>Messages</a>
                </Link>
              </>
            </div>
            <section className={Styles.rightistElements}>
              <img
                onClick={() => setNavOpen(!navOpen)}
                src={`${upload}/${userAvatar}`}
              ></img>
            </section>

            {userInfo && (
              <Navbar
                ref={menuRef}
                navOpen={navOpen}
                username={userInfo.username}
                userAvatar={userAvatar}
              />
            )}
          </>
        ) : (
          <>
            <section className={Styles.ifNotLoggedIn}>
              <Link to={"/login"} className={Styles.ifNotLoggedInText}>
                Login
              </Link>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
