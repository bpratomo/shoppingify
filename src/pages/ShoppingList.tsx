import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import icon from "../assets/source.svg";
import styles from "./ShoppingList.module.css";
import {
  getActiveList,
  getShoppingLists,
  initializeShoppingLists,
  ItemToBuy,
  setActiveList,
} from "../features/shoppingList/shoppingListSlice";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  getActiveListItems,
  initializeActiveListItems,
} from "../features/activeList/activeListSlice";

function ShoppingList({}) {
  const activeList = useAppSelector(getActiveList);
  const activeListItems = useAppSelector(getActiveListItems);
  const shoppingLists = useAppSelector(getShoppingLists);
  const dispatch = useAppDispatch();

  const [categories, setCategories] = useState<string[]>([]);

  enum ActiveDialog {
    addItem,
    closeList,
    none,
  }

  const [dialog, setDialog] = useState<ActiveDialog>(ActiveDialog.none);

  useEffect(() => {
    initializeShoppingLists(dispatch);
  }, []);

  useEffect(() => {
    if (!activeList && shoppingLists) {
      const idList = shoppingLists
        .filter((s) => s.id !== undefined)
        .flatMap((s) => s.id);
      if (idList[0]) {
        dispatch(setActiveList(idList[0]));
      }
    }
  }, [shoppingLists]);

  useEffect(() => {
    if (activeList) {
      initializeActiveListItems(dispatch, activeList.id ? activeList.id : "");
    }
  }, [activeList]);

  useEffect(() => {
    if (activeListItems) {
      console.log(`active List: ${activeListItems}`);
      const realCategories = activeListItems.map((i) => i.item.category);
      // .filter((i) => i);
      console.log(realCategories);
      const distinctCategories = [...new Set(realCategories)];
      setCategories(distinctCategories);
      console.log(`distinct categories: ${distinctCategories}`);
    }
  }, [activeListItems]);

  return (
    <div className={styles.base}>
      <div className={styles.container}>
        <ShoppingHero />
        <section className={styles.title}>
          <div className={styles.title_text}>
            {activeList ? activeList.name : "Shopping List"}
          </div>
          <div className={styles.title_edit}>
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </div>
        </section>
        {categories.length === 0 ? (
          <h3>Shopping list is empty!</h3>
        ) : (
          categories.map((c) => (
            <ShoppingCategoryContainer
              category={c}
              items={
                activeListItems
                  ? activeListItems.filter((i) => i.item.category === c)
                  : []
              }
            />
          ))
        )}
      </div>
      {dialog === ActiveDialog.closeList && <MarkClosedBox />}
      {dialog === ActiveDialog.addItem && <AddItemBox />}
    </div>
  );
}

function ShoppingHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.hero_icon_container}>
        <img src={icon} className={styles.hero_icon} />
      </div>
      <div className={styles.hero_text_container}>
        <div className={styles.hero_text}>Didn't find what you need?</div>
        <button className={styles.hero_add_button}>Add Item</button>
      </div>
    </section>
  );
}

interface ShoppingCategoryContainerProps {
  category: string;
  items: ItemToBuy[];
}

function ShoppingCategoryContainer(props: ShoppingCategoryContainerProps) {
  return (
    <section className={styles.category_container}>
      <div className={styles.category_title}>{props.category}</div>
      {props.items.map((i) => (
        <ShoppingItem item={i} />
      ))}
    </section>
  );
}

interface ShoppingItemProps {
  item: ItemToBuy;
}

function ShoppingItem(props: ShoppingItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.item_text}>{props.item.item.name}</div>
      <div className={`${styles.item_quantity} ${styles.edit}`}>
        <button className={styles.delete}>
          <i className="fa fa-solid fa-trash" aria-hidden="true"></i>
        </button>
        <div className={styles.item_quantity_adjustment}>
          <button className={styles.add}>
            <i className="fa fa-solid fa-plus"></i>
          </button>
          <div className={styles.counter_container}>
            <div className={styles.item_quantity_counter}>
              {`${props.item.quantity}pcs`}
            </div>
          </div>
          <button className={styles.substract}>
            <i className="fa fa-solid fa-minus" aria-hidden="true"></i>
          </button>
        </div>{" "}
      </div>
    </div>
  );
}
function AddItemBox() {
  return (
    <section id={styles.input_box_container}>
      <div className={styles.input_box}>
        {" "}
        <input
          type="text"
          className={styles.input_box_form}
          placeholder="Enter a name"
        />
        <button className={styles.input_button}>Save</button>
      </div>{" "}
    </section>
  );
}

function MarkClosedBox() {
  return (
    <section id={styles.input_box_container} className="">
      <button className={styles.finish_cancel}>Cancel</button>
      <button className={styles.finish_complete}>Complete</button>
    </section>
  );
}

ShoppingList.defaultProps = {};

ShoppingList.propTypes = {};

export default ShoppingList;
