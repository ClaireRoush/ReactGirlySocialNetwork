import React, { useEffect, useState, forwardRef, useContext } from "react";
import Styles from "../css/Navbar.module.css";
import { UserContext } from "../usercontext";

import { Link } from "react-router-dom";
import Notifications from "./Notifications";

const Navbar = forwardRef(({ navOpen, username, userAvatar }, ref) => {
  const [visible, setVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState("main");
  const { userInfo, setUserInfo } = useContext(UserContext);
  const upload = process.env.REACT_APP_UPLOAD;

  useEffect(() => {
    if (navOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [navOpen]);

  function logout() {
    fetch("${api}/logout", {
      credentials: "include",
      method: "POST",
    })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        setVisible(false);
        setUserInfo("");
      })
      .catch((error) => {
        console.error("Failed to logout:", error);
      });
  }

  const renderContent = () => {
    switch (showNotifications) {
      case "notifications":
        return <Notifications />;
      case "main":
      default:
        return (
          <>
            <div className={Styles.navItem}>
              <Link to="/me">My profile</Link>
            </div>
            <div
              className={Styles.navItem}
              onClick={() => setShowNotifications("notifications")}
            >
              <Link>Notifications</Link>
            </div>
            <div className={Styles.navItem}>
              <Link to="/settings">Settings</Link>
            </div>
            <div className={Styles.navItem}>
              <Link to="/" onClick={logout}>
                Logout
              </Link>
            </div>
          </>
        );
    }
  };

  return (
    <div
      ref={ref}
      className={`${Styles.navbar} ${navOpen ? Styles.open : Styles.closed} ${visible ? Styles.visible : ""
        }`}
    >
      <section className={Styles.header}>
        <div className={Styles.userInfo}>
          <img src={`${upload}/${userAvatar}`} alt="User Avatar" />
          {username}
        </div>
      </section>

      <section className={Styles.main}>{renderContent()}</section>
      <section className={Styles.bottomLITTERALYLIKEME}></section>
    </div>
  );
});

export default Navbar;
