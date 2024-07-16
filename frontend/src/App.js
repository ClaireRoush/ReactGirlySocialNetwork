import Styles from "./App.module.css";
import Frogggy from "./svg/svFROG.svg";
import { Routes, Route, BrowserRouter /* Link */ } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
/* import Downer from "./pages/Downer"
 */ import IndexPage from "./pages/Index";
import CreatePost from "./pages/CreatePost";
import UserProfile from "./pages/UserProfile";
import ChangeLog from "./pages/ChangeLog.jsx";
import FullPost from "./pages/FullPost.jsx";
import AboutUs from "./pages/AboutUs";
import Settings from "./pages/Settings.jsx";
import Me from "./pages/Me.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className={Styles.container}>
          <div className={Styles.froggies}>
            <img src={Frogggy} style={{ "--i": 11 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 13 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 10 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 15 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 7 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 17 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 12 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 14 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 9 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 16 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 10.5 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 8 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 13.4 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 9.7 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 14.3 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 11.2 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 8.7 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 12.8 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 10.4 }} alt="Froggy" />
            <img src={Frogggy} style={{ "--i": 17 }} alt="Froggy" />
          </div>
        </div>
        <Routes>
          <Route exact path="/" element={<IndexPage />}></Route>
          <Route path={"login"} element={<Login />} />
          <Route path={"register"} element={<Registration />} />
          <Route path={"create"} element={<CreatePost />} />
          <Route path={"settings"} element={<Settings />} />
          <Route path={"post/:id"} element={<FullPost />} />
          <Route path={"changelog"} element={<ChangeLog />} />
          <Route path={"me"} element={<Me />} />
          <Route path={"/user/:userId"} element={<UserProfile />} />
          <Route path={"about"} element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
