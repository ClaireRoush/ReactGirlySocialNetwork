import React, { useState } from "react";
import Styles from "../css/AboutUs.module.css";
import { Link } from "react-router-dom";
import Header from "./Header";

export default function AboutUs() {
  const [activeSection, setActiveSection] = useState("About project");

  const renderContent = () => {
    switch (activeSection) {
      case "About project":
        return (
          <section className={Styles.meow}>
            <h1>About project!</h1>
            <div className={Styles.text}>
              Добро пожаловать на React Girly Social Network! Социальную сеть,
              построенную на React.js и Node.js с открытым исходным кодом на
              Github!!
            </div>
          </section>
        );
      case "Developers":
        return <section>Developers</section>;
      case "Roadmap":
        return (
          <section className={Styles.meow}>
            <h1 className={Styles.meow}>Roadmap</h1>
            <h1 className={Styles.meow}>1.7</h1>
            <ul>Сделать систему уведомлений!!</ul>
            <ul>
              Сделать асоциации с пользователем в контактах в случае смены
              никнейма + установки свеого{" "}
            </ul>
            <ul>Пофиксить абоут ми</ul>
            <ul>Раскрас каждого элемента под свой цвет</ul>
            <ul>Как минимум </ul>
          </section>
        );
      default:
        return <section>About project</section>;
    }
  };

  return (
    <div className={Styles.aboutUsContainer}>
      <Header />
      <section className={Styles.itemsContainer}>
        <div
          className={Styles.aboutUsMain}
          onClick={() => setActiveSection("About project")}
        >
          <h1>About project</h1>
        </div>
        <div
          className={Styles.aboutUsMain}
          onClick={() => setActiveSection("Roadmap")}
        >
          <h1>Roadmap</h1>
        </div>
        <div
          className={Styles.aboutUsMain}
          onClick={() => setActiveSection("Developers")}
        >
          <h1>Developers</h1>
        </div>
      </section>
      <div className={Styles.mainThing}>{renderContent()}</div>
    </div>
  );
}
