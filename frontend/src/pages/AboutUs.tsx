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
            <h1 className={Styles.meow}>1.8</h1>
            <ul>Сделать систему уведомлений!!</ul>
            <ul>
              Сделать асоциации с пользователем в контактах в случае смены
              никнейма + установки свеого
            </ul>
            <ul>Линки в навбаре тоже...</ul>
            <ul>Пофиксить css на userProfile</ul>
            <ul>Пофиксить абоут ми</ul>
            <ul>Раскрас каждого элемента под свой цвет</ul>
            <ul>Как минимум чат доделать...</ul>
            <ul>
              Не забыть про возможность редактирования своих постов и
              комментариев...
            </ul>
            <ul>Добавить хотя бы лейзинг лоудинг...</ul>
            <ul>Баннеры!!!!</ul>
            <ul>На гитхабе сделать нормальный readme</ul>
            <ul>Уведомления тоже пофиксить</ul>
            <ul>Возможность загружать собственные стикеры / эмодзи (хотя бы штучек 10)</ul>
            <ul>Возможность изменять фон / летающие смайлики</ul>
            <ul>Возможность обрезать фотографию для аватара</ul>
            <ul>Возможности...</ul>
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
