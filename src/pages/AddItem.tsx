import React, { FC } from "react";
import styles from "./AddItem.module.css";

interface AddItemProps {}

export const AddItem: FC<AddItemProps> = (props) => {
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
          />
        </label>
        <label>
          <br />
          Category <br />
          <input
            className={styles.form_short}
            type="dropdown"
            name=""
            id="name"
            placeholder="Enter a category"
          />
        </label>
      </section>{" "}
      <section id={styles.input_box_container} className="">
        <button className={styles.cancel}>Cancel</button>
        <button className={styles.save}>Save</button>
      </section>
    </div>
  );
};
