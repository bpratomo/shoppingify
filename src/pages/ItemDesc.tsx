import styles from "./ItemDesc.module.css";
import React, { FC } from "react";
import {
  getActiveList,
  ItemToBuy,
} from "../features/shoppingList/shoppingListSlice";
import {
  fsAddNewItem,
  fsDeleteItem,
} from "../features/activeList/activeListSlice";
import { useAppSelector } from "../app/hooks";
import { deleteItem, ItemType } from "../features/item/itemSlice";

interface ItemDescProps {
  item: ItemType;
  activateShoppingList: () => void;
}

export const ItemDesc: FC<ItemDescProps> = (props) => {
  const activeList = useAppSelector(getActiveList);

  function handleItemAdd() {
    const itemToBuy: ItemToBuy = {
      item: props.item,
      quantity: 1,
    };
    if (activeList && activeList.id) {
      fsAddNewItem(activeList.id, itemToBuy);

      props.activateShoppingList();
    } else {
      alert("NOT IMPLEMENTED");
    }
  }

  function handleDelete() {
    if (props.item.id) {
      deleteItem(props.item.id);
      props.activateShoppingList();
    }
  }

  return (
    <div className={styles.base}>
      <div className={styles.backtext} onClick={props.activateShoppingList}>
        <i className="fas fa-long-arrow-alt-left"> </i> back
      </div>
      <div className={styles.imageContainer}>
        <img src={props.item.imageUrl} />
      </div>
      <div className={styles.text}>
        <div className={styles.label}>name</div>
        <div className={styles.content}>{props.item.name}</div>
      </div>
      <div className={styles.text}>
        <div className={styles.label}>category</div>
        <div className={styles.content}>{props.item.category}</div>
      </div>{" "}
      <div className={styles.text}>
        <div className={styles.label}>note</div>
        <div className={styles.content}>{props.item.note}</div>
      </div>{" "}
      <section id={styles.input_box_container} className="">
        <button className={styles.delete} onClick={handleDelete}>
          Delete
        </button>
        <button className={styles.add} onClick={handleItemAdd}>
          Add to List
        </button>
      </section>
    </div>
  );
};
