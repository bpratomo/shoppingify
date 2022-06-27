import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./ItemList.module.css";
import Item from "../components/Item";
import { ItemType, getItems, useItems } from "../features/item/itemSlice";
import { useAppSelector } from "../app/hooks";
let sampleItemList = [
  {
    category: "Fruit and Vegetables",
    name: "Avocado",
  },
  {
    category: "Fruit and Vegetables",
    name: "Avocado",
  },
  {
    category: "Fruit and Vegetables",
    name: "Avocado",
  },
  {
    category: "Fruit and Vegetables",
    name: "Avocado",
  },
  {
    category: "Fruit and Vegetables",
    name: "Avocado",
  },
  {
    category: "Fruit and Vegetables",
    name: "Avocado",
  },
  {
    category: "Fruit and Vegetables",
    name: "Avocado",
  },

  {
    category: "Fish",
    name: "Salmon",
  },
];

interface CategoryContainerProps {
  category: String;
  items: ItemType[];
}

function CategoryContainer(props: CategoryContainerProps) {
  const [relevantItems, setRelevantItems] = useState<ItemType[]>(props.items);
  const [counter, setCounter] = useState(0);
  if (counter === 0) {
    useItems();
    setCounter(1);
  }
  useEffect(() => {
    useItems();
    let filtered = props.items.filter((i) => i.category === props.category);
    setRelevantItems(filtered);
    let oldCounter = counter;
    setCounter(oldCounter + 1);
    console.log(props.category);
  }, []);

  return (
    <section className={styles.category__container}>
      <h3 className={styles.category__header}>{props.category}</h3>
      <div className={styles.category__items}>
        {relevantItems.map((i) => (
          <Item item={i} />
        ))}
      </div>
    </section>
  );
}

function ItemList({}) {
  const items = useAppSelector(getItems);
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
      <CategoryContainer category="Fruit and Vegetables" items={items} />
    </div>
  );
}
ItemList.defaultProps = {};

export default ItemList;
