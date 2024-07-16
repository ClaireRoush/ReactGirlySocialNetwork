import React from "react";
import Styles from "../css/AboutUs.module.css";
import { Link } from "react-router-dom";
export default function AboutUs() {
  return (
    <div className={Styles.aboutUsContainer}>
      <div className={Styles.aboutUsMain}>
        <h1>About project</h1>
      </div>
      <div className={Styles.aboutUsMain}>
        <h1>Developers</h1>
      </div>
      <div className={Styles.aboutUsMain}>
        <h1>Roadmap</h1>
      </div>
    </div>
  );
}
