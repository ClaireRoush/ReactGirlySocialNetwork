import React from "react";
import { useContext, useState } from "react";
import { UserContext } from "../usercontext";
import { Link } from "react-router-dom";

export default function Settings() {
  const [userAvatar, setUserAvatar] = useState("");

  async function changeInfo(ev) {
    ev.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch(
      "https://reactgirlysocialnetwork-backend-dzs8.onrender.com/settings",
      {
        method: "Post",
        body: JSON.stringify({ userAvatar }),
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      {
        alert("meow");
      }
    }
  }

  return (
    <div>
      <Link to={"/"}>back</Link>
      <form onSubmit={changeInfo}>
        <input
          type="text"
          placeholder="avatar url"
          value={userAvatar}
          onChange={(ev) => setUserAvatar(ev.target.value)}
        />
        <button>Save</button>
      </form>
    </div>
  );
}
