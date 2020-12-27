import React from "react";
import styles from "./Spinner.module.css";

export default function Spinner() {
  return (
    <div className={styles.spinner_cont}>
      <span className={styles.spinner}></span>
    </div>
  ) 
}