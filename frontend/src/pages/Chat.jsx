import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../usercontext";
import { io } from "socket.io-client";
import Styles from "../css/Chat.module.css";
import Header from "./Header";
import hash from "hash.js";

export default function Chat() {
  const { userInfo } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const username = userInfo?.username;
  const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
  const api = process.env.REACT_APP_API_URL;
  const upload = process.env.REACT_APP_UPLOAD;
  const messagesEndRef = useRef(null);

  /*   useEffect(() => {
    const newSocket = io(`http://localhost`);
    setSocket(newSocket);

    newSocket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      newSocket.off("chat message");
      newSocket.disconnect();
    };
  }, []); */

  useEffect(() => {
    const fetchContacts = async () => {
      if (!token) return;
      const response = await fetch(`${api}/getContacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setContacts(data);
      }
    };
    fetchContacts();
  }, [token]);

  const handleContactClick = async (contact) => {
    setSelectedContact(contact);
    if (room && socket) {
      socket.emit("leave room", room);
    }
    const fetchMessages = await fetch(`${api}/messages/${contact.username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const roomName = hash
      .sha256()
      .update([contact.username, username, SECRET_KEY].sort().join("_"))
      .digest("hex");

    const data = await fetchMessages.json();
    setMessages(data);
    setRoom(roomName);
    if (socket) {
      socket.emit("join room", roomName);
    }
  };

  const sendMessage = (msg) => {
    if (socket && room) {
      socket.emit("chat message", { room, message: msg });
      setMessage("");
    }
  };

  const postMessage = async (ev) => {
    ev.preventDefault();

    if (selectedContact && message.trim()) {
      const response = await fetch(
        `${api}/messages/${selectedContact.username}`,
        {
          method: "POST",
          body: JSON.stringify({ message }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        const msg = {
          _id: data._id,
          user: {
            username: data.user.username,
            userAvatar: data.user.userAvatar,
          },
          message: data.message,
          timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, msg]);

        sendMessage(msg);

        setMessage("");
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <Header></Header>

      <div className={Styles.wrapperForAll}>
        <section className={Styles.header}>
          {selectedContact ? (
            <>
              <img src={`${upload}/${selectedContact.userAvatar}`} alt="" />
              <div>{selectedContact.username}</div>
            </>
          ) : (
            <div>Select a contact to start chatting</div>
          )}
        </section>

        <section className={Styles.navBar}>
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <div
                key={index}
                onClick={() => handleContactClick(contact)}
                className={Styles.user}
              >
                <img src={`${upload}${contact.userAvatar}`} alt=""></img>
                {contact.username}
              </div>
            ))
          ) : (
            <p>No contacts found.</p>
          )}
        </section>

        <section className={Styles.messages}>
          <div className={Styles.messagesWrapper} ref={messagesEndRef}>
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg._id} className={Styles.message}>
                  <div className={Styles.senderInfo}>
                    <img
                      src={
                        msg.user?.userAvatar
                          ? msg.user.userAvatar.startsWith("http")
                            ? msg.user.userAvatar
                            : `${upload}/${msg.user.userAvatar}`
                          : msg.userAvatar.startsWith("http")
                          ? msg.userAvatar
                          : `${upload}/${msg.userAvatar}`
                      }
                      alt={msg.user?.username || "avatar"}
                    />
                  </div>
                  <div className={Styles.messageContent}>
                    <a>{msg.user?.username}</a>
                    <div className={Styles.text}>{msg.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>

          <section className={Styles.inputWrapper}>
            <form onSubmit={postMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </form>
          </section>
        </section>
      </div>
    </div>
  );
}
