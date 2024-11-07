import React, { FormEvent } from "react";
import { useState } from "react";
import { FormEncType, Link } from "react-router-dom";
import Styles from "./Registration.module.css";

const MadokaImg = process.env.REACT_APP_STATIC_URL + "/images/MadokaRegister.jpg";
const api = process.env.REACT_APP_API_URL;

export function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function register(ev: FormEvent) {
    ev.preventDefault();
    const response = await fetch(`${api}/register`, {
      method: "Post",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("Success!!!11!!");
    } else {
      alert("Registration failed, you are just too silly!!!");
    }
  }

  return (
    <div className={Styles.wrapper}>
      <img src={MadokaImg}></img>
      <h1>Registration!!</h1>

      <form onSubmit={register}>
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

        <button>Sign up</button>
      </form>
      <Link to="/login">
        <a>Already have an account? </a>{" "}
      </Link>
    </div>
  );
}
