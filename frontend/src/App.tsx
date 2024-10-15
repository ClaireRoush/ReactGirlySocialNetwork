import React from "react";
import Styles from "./App.module.css";
import { Routes, Route, BrowserRouter /* Link */ } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import IndexPage from "./pages/Index";
import CreatePost from "./pages/CreatePost";
import UserProfile from "./pages/UserProfile";
import ChangeLog from "./pages/ChangeLog";
import FullPost from "./pages/FullPost";
import Settings from "./pages/Settings";
import Me from "./pages/Me";
import Chat from "./pages/Chat";

const Frogggy = process.env.REACT_APP_STATIC_URL + "/images/svFROG.svg";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className={Styles.container}>
          <div className={Styles.froggies}>
            <img src={Frogggy} style={{ "--i": 11 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 13 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 10 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 15 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 7 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 17 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 12 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 14 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 9 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 16 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 10.5 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 8 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 13.4 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 9.7 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 14.3 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 11.2 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 8.7 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 12.8 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 10.4 } as any} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 17 } as any} alt="Froggy" />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<IndexPage />}></Route>
          <Route path={"login"} element={<Login />} />
          <Route path={"register"} element={<Registration />} />
          <Route path={"create"} element={<CreatePost updatePosts={() => {}}/>} />
          <Route path={"settings"} element={<Settings />} />
          <Route path={"post/:id"} element={<FullPost />} />
          <Route path={"changelog"} element={<ChangeLog />} />
          <Route path={"me"} element={<Me />} />
          <Route path={"/user/:userId"} element={<UserProfile />} />
          <Route path={"chat"} element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
