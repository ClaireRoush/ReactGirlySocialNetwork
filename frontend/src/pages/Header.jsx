import React from "react";
import Styles from "../css/Header.module.css";
import { useContext, useEffect } from "react";
import { UserContext } from "../usercontext";
import { Link } from "react-router-dom";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("https://reactgirlysocialnetwork-backend-dzs8.onrender.com/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("https://reactgirlysocialnetwork-backend-dzs8.onrender.com/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    /* НАСРАНО */
    <div className={Styles.header}>
      {username && (
        <div className={Styles.meow}>
          <div className={Styles.logout}>
            <Link to={`/userProfile/${userInfo.username}`}>
              {userInfo.username}
            </Link>
          </div>
          <div classname={Styles.logout}>
            <Link to="/create">
              <a>Post some shit</a>
            </Link>
          </div>
          <div className={Styles.logout} onClick={logout}>
            <a>Logout</a>
          </div>
        </div>
      )}

      {!username && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
}
