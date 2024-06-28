import React, { useContext, useEffect } from "react";
import Styles from "../css/Header.module.css";
import { UserContext } from "../usercontext";
import { Link } from "react-router-dom";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userInfo) {
      fetch("http://localhost:6969/profile", {
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

  function logout() {
    fetch("http://localhost:6969/logout", {
      credentials: "include",
      method: "POST",
    })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo")
        setUserInfo(null); 
      })
      .catch((error) => {
        console.error("Failed to logout:", error);
      });
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
