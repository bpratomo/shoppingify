import React, { FC } from "react";

import icon from "../assets/logo.svg";
import styles from "./Sidebar.module.css";
interface SidebarProps {}

export const Sidebar: FC<SidebarProps> = (props) => {
  return (
    <div className={styles.base}>
      <div className={styles.logo}>
        <img src={icon} className="" />
      </div>
      <div className={styles.navIcons}>
        <div className={styles.icon}>
          <div className={styles.active}>,</div>
          <div>
            <i className="fas fa-list"></i>
          </div>{" "}
        </div>
        <div className={styles.icon}>
          <i className="fas fa-redo"></i>
        </div>
        <div className={styles.icon}>
          <i className="far fa-chart-bar"></i>
        </div>
      </div>{" "}
      <div className={styles.cart}>
        <i className="fas fa-shopping-cart"></i>
        <div className={styles.itemCount}>3</div>
      </div>
    </div>
  );
};
