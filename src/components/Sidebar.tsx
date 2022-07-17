import { FC } from "react";

import icon from "../assets/logo.svg";
import styles from "./Sidebar.module.css";
import { ActivePage } from "../App";
interface SidebarProps {
  setActivePage: (a: ActivePage) => void;
  activePage: ActivePage;
}

export const Sidebar: FC<SidebarProps> = (props) => {
  return (
    <div className={styles.base}>
      <div className={styles.logo}>
        <img src={icon} alt="The app logo"  className="" />
      </div>
      <div className={styles.navIcons}>
        <div
          className={styles.icon}
          onClick={() => props.setActivePage(ActivePage.ItemList)}
        >
          <div
            className={
              props.activePage === ActivePage.ItemList
                ? styles.active
                : styles.inactive
            }
          >
            ,
          </div>
          <div>
            <i className="fas fa-list"></i>
          </div>{" "}
        </div>
        <div
          className={styles.icon}
          onClick={() => props.setActivePage(ActivePage.ShoppingLists)}
        >
          <div
            className={
              props.activePage === ActivePage.ShoppingLists
                ? styles.active
                : styles.inactive
            }
          >
            ,
          </div>
          <i className="fas fa-redo"></i>
        </div>
        <div className={styles.icon}>
          <div className="">,</div>
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
