import { useState } from "react";
import styles from "./ItemList.module.css";
import CategoryContainer from "../components/CategoryContainer/CategoryContainer";
import { getItems, ItemType } from "../features/item/itemSlice";
import {  useAppSelector } from "../app/hooks";
interface ItemListProps {
  activateItemDesc: (i: ItemType) => void;
}

function ItemList(props: ItemListProps) {
  const [searchText, setSearchText] = useState("");
  const items = useAppSelector(getItems);
  const relevantItems =
    items.length > 0
      ? items.filter((i) =>
          i.name
            ? i.name.toLowerCase().includes(searchText.toLowerCase())
            : undefined
        )
      : [];

  let allCategories = relevantItems.map((i) => i.category).filter((i) => i);
  let categories = [...new Set(allCategories)];
  // console.log(`allcategories:${allCategories}`);
  // console.log(`categories: ${categories} ${categories.length}`);
  // console.log(`items: ${items}`);

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

      {categories.map((c) => (
        <CategoryContainer
          category={c}
          items={relevantItems}
          key={c}
          activateItemDesc={props.activateItemDesc}
        />
      ))}
    </div>
  );
}
ItemList.defaultProps = {};

export default ItemList;
