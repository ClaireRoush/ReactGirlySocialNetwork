import React, { useContext, useEffect, useState } from "react";
import Styles from "../css/Header.module.css";
import { UserContext } from "../usercontext";
import { Link, useParams } from "react-router-dom";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [userAvatar, setUserAvatar] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userInfo) {
      fetch(
        "https://reactgirlysocialnetwork-backend-dzs8.onrender.com/profile",
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

  function logout() {
    fetch("https://reactgirlysocialnetwork-backend-dzs8.onrender.com/logout", {
      credentials: "include",
      method: "POST",
    })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        setUserInfo(null);
      })
      .catch((error) => {
        console.error("Failed to logout:", error);
      });
  }

  const username = userInfo?.username;
  useEffect(() => {
    fetch(
      `https://reactgirlysocialnetwork-backend-dzs8.onrender.com/findUserAvatar/${username}`
    ).then((response) => {
      response.json().then((userAvatar) => {
        setUserAvatar(userAvatar);
      });
    });
  }, []);

  return (
    /* НАСРАНО */
    <div className={Styles.header}>
      <div className={Styles.ifNotLoggedIn}>
        {!username && (
          <div className={Styles.headerContainer}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
      {username && (
        <div className={Styles.headerContainer}>
          <div className={Styles.userProfile}>
            <img src={userAvatar}></img>
            <Link to={`/userProfile/${userInfo.username}`}>
              <a>{userInfo.username}</a>
            </Link>
          </div>
          <div className={Styles.postSomeShit}>
            <Link to="/create">
              <a>Post some shit</a>
            </Link>
          </div>
          <div className={Styles.logout} onClick={logout}>
            <a>Logout</a>
          </div>
        </div>
      )}
    </div>
  );
}
