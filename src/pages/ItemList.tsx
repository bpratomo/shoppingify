import { useState } from "react";
import styles from "./ItemList.module.css";
import CategoryContainer from "../components/CategoryContainer/CategoryContainer";
import { getItems } from "../features/item/itemSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

function ItemList({}) {
  const items = useAppSelector(getItems);
  const [counter, setCounter] = useState(0);
  const [searchText, setSearchText] = useState("");

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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </section>
      <CategoryContainer
        category="Fruits and Vegetables"
        items={items}
        searchString={searchText}
      />
    </div>
  );
}
ItemList.defaultProps = {};

export default ItemList;
