import React from "react";
import PropTypes from "prop-types";
import styles from "./Item.module.css";

export interface ItemType {
  category: String;
  name: String;
}

interface ItemProps {
  item: ItemType;
}

function Item(props: ItemProps) {
  return (
    <div className={styles.base}>
      <div>{props.item.name}</div>
      <i className="fas fa-plus"></i>
    </div>
  );
}

export default Item;
