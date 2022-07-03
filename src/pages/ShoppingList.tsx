import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import icon from "../assets/source.svg";
import styles from "./ShoppingList.module.css";
import {
  getActiveListId,
  initializeShoppingLists,
  setActiveList,
} from "../features/shoppingList/shoppingListSlice";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { initializeActiveList } from "../features/activeList/activeListSlice";

function ShoppingItem() {
  const activeListId = useAppSelector(getActiveListId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!activeListId) {
      initializeShoppingLists(dispatch);
    }
  }, []);

  useEffect(() => {
    if (activeListId) {
      dispatch(setActiveList(activeListId));
      initializeActiveList(dispatch, activeListId);
    }
  }, [activeListId]);

  return (
    <div className={styles.item}>
      <div className={styles.item_text}>Pre-cooked corn</div>
      <div className={`${styles.item_quantity} ${styles.edit}`}>
        <button className={styles.delete}>
          <i className="fa fa-solid fa-trash" aria-hidden="true"></i>
        </button>
        <div className={styles.item_quantity_adjustment}>
          <button className={styles.add}>
            <i className="fa fa-solid fa-plus"></i>
          </button>
          <AddItemBox />
          <div className={styles.counter_container}>
            <div className={styles.item_quantity_counter}>3pcs</div>
          </div>{" "}
          <button className={styles.substract}>
            <i className="fa fa-solid fa-minus" aria-hidden="true"></i>
          </button>
        </div>{" "}
      </div>
    </div>
  );
}

function ShoppingCategoryContainer() {
  return (
    <section className={styles.category_container}>
      <div className={styles.category_title}>Fruit and vegetables</div>
      <ShoppingItem />
    </section>
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

function AddItemBox() {
  return (
    <section id={styles.input_box_container} className={styles.hide}>
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

function ShoppingList({}) {
  return (
    <div className={styles.base}>
      <div className={styles.container}>
        <ShoppingHero />
        <section className={styles.title}>
          <div className={styles.title_text}>Shopping list</div>
          <div className={styles.title_edit}>
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </div>
        </section>
        <ShoppingCategoryContainer />
      </div>
      <MarkClosedBox />
      <AddItemBox />
    </div>
  );
}

ShoppingList.defaultProps = {};

ShoppingList.propTypes = {};

export default ShoppingList;
