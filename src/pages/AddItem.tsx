import React, { FC, useState } from "react";
import { useAppSelector } from "../app/hooks";
import styles from "./AddItem.module.css";

import { createNewItem, getItems, ItemType } from "../features/item/itemSlice";
interface AddItemProps {
  activateShoppingList: () => void;
}

interface DropDownProps {
  categoryString: string;
  setIsDropdownActive: (s: boolean) => void;
  setCategory: (s: string) => void;
  triggerBlur: () => void;
}

const CategoryDropdown: FC<DropDownProps> = (props: DropDownProps) => {
  const items = useAppSelector(getItems);
  let allCategories = items.map((i) => i.category).filter((i) => i);
  let relevantCategories = allCategories.filter((c) =>
    c.toLowerCase().includes(props.categoryString.toLowerCase())
  );
  let categories = [...new Set(relevantCategories)];
  function handleClick(category: string, e: React.MouseEvent) {
    props.setCategory(category);
    props.setIsDropdownActive(false);
    props.triggerBlur();
    console.log(document.activeElement);
  }

  return (
    <ul className={styles.category_dropdown}>
      {categories.map((c) => (
        <li onClick={(e) => handleClick(c, e)}>{c}</li>
      ))}
    </ul>
  );
};

export const AddItem: FC<AddItemProps> = (props) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
  function triggerBlur() {
    const categoryInput = document.getElementById("categoryInput");
    console.log(categoryInput);

    categoryInput?.blur();
  }
  function handleSubmit() {
    createNewItem({
      name: name,
      category: category,
      note: note,
      imageUrl: imageUrl,
    });
    props.activateShoppingList();
  }
  return (
    <div className={styles.base}>
      <h1>Add a new Item</h1>
      <section className="form">
        <label>
          Name <br />
          <input
            className={styles.form_short}
            type="text"
            name=""
            id="name"
            placeholder="Enter a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          <br />
          Note (optional) <br />
          <input
            className={styles.form_short}
            type="text"
            name=""
            id="name"
            placeholder="Enter a note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <label>
          <br />
          Image (optional)
          <br />
          <input
            className={styles.form_short}
            type="text"
            name=""
            id="name"
            placeholder="Enter a URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        <label>
          <br />
          Category <br />
          <section className={`${styles.form_short} ${styles.dropdownInput}`}>
            <input
              className={styles.input}
              type="text"
              name=""
              id="categoryInput"
              placeholder="Enter a category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onFocus={() => setIsDropdownActive(true)}
              onBlur={(e) => {
                console.log(e.relatedTarget);

                if (
                  e.relatedTarget &&
                  e.relatedTarget.id === "categoryDropdown"
                ) {
                } else {
                  setIsDropdownActive(false);
                }
              }}
            />

            <i className="fas fa-times" onClick={() => setCategory("")} />
          </section>
          <section
            tabIndex={0}
            id="categoryDropdown"
            className={isDropdownActive ? "" : styles.hide}
          >
            <CategoryDropdown
              categoryString={category}
              setIsDropdownActive={setIsDropdownActive}
              setCategory={setCategory}
              triggerBlur={triggerBlur}
            />
          </section>{" "}
        </label>
      </section>{" "}
      <section id={styles.input_box_container} className="">
        <button className={styles.cancel} onClick={props.activateShoppingList}>
          Cancel
        </button>
        <button className={styles.save} onClick={handleSubmit}>
          Save
        </button>
      </section>
    </div>
  );
};
