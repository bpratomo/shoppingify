import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./ItemList.module.css";
import Item from "../components/Item";
import {
  ItemType,
  getItems,
  initializeItems,
} from "../features/item/itemSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
interface CategoryContainerProps {
  category: String;
  items: ItemType[];
}

function CategoryContainer(props: CategoryContainerProps) {
  return (
    <section className={styles.category__container}>
      <h3 className={styles.category__header}>{props.category}</h3>
      <div className={styles.category__items}>
        {props.items
          .filter((i) => i.category === props.category)
          .map((i) => (
            <Item item={i} key={i.id} />
          ))}
      </div>
    </section>
  );
}

function ItemList({}) {
  const items = useAppSelector(getItems);
  const [counter, setCounter] = useState(0);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (counter === 0) {
      initializeItems(dispatch);
      // setCounter(1);
      console.log("triggered");
    }
  }, []);
  return (
    <div className={styles.base}>
      <section className={styles.header}>
        <div className={styles.header__text}>
          <span className={styles.colored}>Shoppingify </span>
          allows you to take your shopping list wherever you go
        </div>
        <div className={styles.searchbar}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            className={styles.searchbar__text}
            placeholder="Search here..."
          />
        </div>
      </section>
      <CategoryContainer category="Fruits and Vegetables" items={items} />
    </div>
  );
}
ItemList.defaultProps = {};

export default ItemList;
