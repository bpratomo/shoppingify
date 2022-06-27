import React from "react";
import PropTypes from "prop-types";
import { ItemType } from "../features/item/itemSlice";
import styles from "./Item.module.css";

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
