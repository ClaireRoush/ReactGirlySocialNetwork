import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../usercontext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch(
      "https://reactgirlysocialnetwork-backend-dzs8.onrender.com/login",
      {
        method: "Post",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (response.ok) {
      response.json().then((userInfo) => {
        localStorage.setItem("token", userInfo.token);
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert("You are too silly!!1!! Absolutly silly!11!1!");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="Wrapper">
      <h1>Login</h1>

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
      <Link to="/register">Click here to get account</Link>
    </div>
  );
}
