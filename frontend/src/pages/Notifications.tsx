import React, { useEffect, useState } from "react";
import Notif from "./Notif";
import Styles from "../css/Notifications.module.css";

const Frog = process.env.REACT_APP_STATIC_URL + "/images/svFROG.svg";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const api = process.env.REACT_APP_API_URL;


  useEffect(() => {
    fetch(`${api}/notifications`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }).then((response) => {
      response.json().then((notifications) => {
        setNotifications(notifications);
      }).catch((error) => {
        console.error("Error fetching notifications:", error);
      });
    });
  }, [token]);
  return (
    <div className={Styles.notificationsContainer}>
      <div className={Styles.header}>
        <a>notifications</a>
        <a>mark as read</a>
      </div>
      <div className={Styles.main}>
        {notifications.map((notifications) => (
          <Notif
            userAvatar={notifications.userAvatar}
            postUser={notifications.whoIsPost}
            likedOn={notifications.likedOn}
            commentedOn={notifications.commentedOn}
          ></Notif>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
