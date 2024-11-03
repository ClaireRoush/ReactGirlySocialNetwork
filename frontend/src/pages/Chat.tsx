import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserContext } from "../usercontext";
import { io, Socket } from "socket.io-client";
import Styles from "../css/Chat.module.css";
import Header from "./Header";
import hash from "hash.js";
import VoiceCall from "./VoiceCall";

export default function Chat() {
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [me, setMe] = useState("");
  const [hasJoinedRooms, setHasJoinedRooms] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
  const api = process.env.REACT_APP_API_URL;
  const upload = process.env.REACT_APP_UPLOAD;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [videoCall, setVideoCall] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const newSocket = io("http://localhost:6969");
    setSocket(newSocket);

    newSocket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

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
        const currentUser = data[0];
        setMe(currentUser.me);
        if (!hasJoinedRooms && socket) {
          socket.emit("joinRooms", data);
          setHasJoinedRooms(true);
        }
      }
    };

    fetchContacts();
  }, [token, socket, hasJoinedRooms]);

  const handleContactClick = async (contact: any) => {
    setSelectedContact(contact);
    const fetchMessages = await fetch(`${api}/messages/${contact.username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await fetchMessages.json();
    setMessages(data);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const postMessage = async (ev: FormEvent) => {
    ev.preventDefault();

    if (selectedContact && message.trim() && socket) {
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
          forWho: selectedContact,
        };

        socket.emit("sendMessage", msg);
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    }
  };

  async function callStart() {
    setVideoCall(true);
  }

  return (
    <div>
      <Header color={"#FFFFFF"} />
      <div className={Styles.wrapperForAll}>
        {videoCall ? (
          <VoiceCall me={me} anotherUsername={selectedContact.username} />
        ) : (
          <></>
        )}
        <section className={Styles.header}>
          {selectedContact ? (
            <>
              <img src={`${upload}/${selectedContact.userAvatar}`} alt="" />
              <div>{selectedContact.username}</div>
              <div onClick={callStart}>Start call</div>
            </>
          ) : (
            <div></div>
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
            <p>you dont have any contacts :(</p>
          )}
        </section>

        <section className={Styles.messages}>
          <div className={Styles.messagesWrapper}>
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg._id} className={Styles.message}>
                  <div className={Styles.senderInfo}>
                    <img alt={msg.user?.username || "avatar"} />
                  </div>
                  <div className={Styles.messageContent}>
                    <a>{msg.user?.username}</a>
                    <div className={Styles.text}>{msg.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <p></p>
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
