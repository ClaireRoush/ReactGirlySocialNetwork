import { Link, Navigate } from "react-router-dom";
import React, { useContext, useState, FormEvent } from "react";
import { UserContext } from "../usercontext";
import Styles from "../css/Login.module.css";
const api = process.env.REACT_APP_API_URL;

const MadokaImg =
  process.env.REACT_APP_STATIC_URL + "/images/MadokaRegister.jpg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev: FormEvent) {
    ev.preventDefault();
    const response = await fetch(`${api}/login`, {
      method: "Post",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      response
        .json()
        .then((userInfo) => {
          localStorage.setItem("token", userInfo.token);
          setUserInfo(userInfo);
          setRedirect(true);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    } else {
      alert("You are too silly!!1!! Absolutly silly!11!1!");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className={Styles.wrapper}>
      <img src={MadokaImg}></img>

      <h1>Login!!</h1>

      <form onSubmit={login}>
        <input
          type="text"
          placeholder="Login"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button>Sign in</button>
      </form>
      <Link to="/register">New here? Create your account!!</Link>
    </div>
  );
}
