import  { useState, useEffect } from "react";
import icon from "../assets/source.svg";
import styles from "./ShoppingList.module.css";
import {
  getActiveList,
  ItemToBuy,
  Status,
  updateShoppingListName,
  updateShoppingListStatus,
} from "../features/shoppingList/shoppingListSlice";

import {  useAppSelector } from "../app/hooks";
import {
  fsDeleteItem,
  fsUpdateQuantity,
  getActiveListItems,
} from "../features/activeList/activeListSlice";

enum ActiveDialog {
  rename,
  closeList,
}
interface ShoppingListProps {
  activateAddItem: () => void;
}

function ShoppingList(props: ShoppingListProps) {
  const activeList = useAppSelector(getActiveList);
  const activeListItems = useAppSelector(getActiveListItems);

  const [categories, setCategories] = useState<string[]>([]);

  const [dialog, setDialog] = useState<ActiveDialog>(ActiveDialog.closeList);
  useEffect(() => {
    if (activeListItems) {
      const realCategories = activeListItems.map((i) => i.item.category);
      const distinctCategories = [...new Set(realCategories)];
      setCategories(distinctCategories);
    }
  }, [activeListItems]);

  return (
    <div className={styles.base}>
      <div className={styles.container}>
        <ShoppingHero activateAddItem={props.activateAddItem} />
        <section className={styles.title}>
          <div className={styles.title_text}>
            {activeList ? activeList.name : "Shopping List"}
          </div>
          <div
            className={styles.title_edit}
            onClick={() => setDialog(ActiveDialog.rename)}
          >
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </div>
        </section>
        {categories.length === 0 ? (
          <h3>Shopping list is empty!</h3>
        ) : (
          categories.map((c, i) => (
            <ShoppingCategoryContainer
              category={c}
              items={
                activeListItems
                  ? activeListItems.filter((i) => i.item.category === c)
                  : []
              }
              key={i}
            />
          ))
        )}
      </div>
      {dialog === ActiveDialog.closeList && <MarkClosedBox />}
      {dialog === ActiveDialog.rename && <RenameBox toggle={setDialog} />}
    </div>
  );
}

interface ShoppingHeroProps {
  activateAddItem: () => void;
}

function ShoppingHero(props: ShoppingHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.hero_icon_container}>
        <img src={icon} className={styles.hero_icon} />
      </div>
      <div className={styles.hero_text_container}>
        <div className={styles.hero_text}>Didn't find what you need?</div>
        <button
          className={styles.hero_add_button}
          onClick={props.activateAddItem}
        >
          Add Item
        </button>
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
        <ShoppingItem item={i} key={i.id} />
      ))}
    </section>
  );
}

interface ShoppingItemProps {
  item: ItemToBuy;
}

function ShoppingItem(props: ShoppingItemProps) {
  const [editActive, setEditActive] = useState<boolean>(false);
  function toggleActive() {
    setEditActive(!editActive);
  }
  const activeList = useAppSelector(getActiveList);

  function adjustQuantity(delta: number) {
    if (activeList && activeList.id) {
      if (props.item.quantity + delta === 0) {
        deleteItem();
      } else {
        fsUpdateQuantity(
          activeList.id,
          props.item,
          props.item.quantity + delta
        );
      }
    } else alert("NOT IMPLEMENTED: active list is undefined");
  }

  function deleteItem() {
    console.log("triggered");
    if (activeList && activeList.id) {
      fsDeleteItem(activeList.id, props.item);
    }
  }

  function handleOnBlur(e: any) {
    e.stopPropagation();
    console.log("Target");

    console.log(e.target);
    console.log("Current target");

    console.log(e.currentTarget);
    console.log("related Target");

    console.log(e.relatedTarget);

    if (e.target.contains(e.relatedTarget)) {
      return;
    }

    setEditActive(false);
  }
  return (
    <div
      className={styles.item}
      id={props.item.id}
      onBlur={handleOnBlur}
      tabIndex={0}
    >
      <div className={styles.item_text}>{props.item.item.name}</div>
      <div
        className={`${styles.item_quantity} ${editActive ? styles.edit : ""}`}
      >
        <button className={styles.delete} onClick={deleteItem}>
          <i className="fa fa-solid fa-trash" aria-hidden="true"></i>
        </button>
        <div className={styles.item_quantity_adjustment}>
          <button
            className={styles.add}
            tabIndex={0}
            onClick={() => adjustQuantity(1)}
          >
            <i className="fa fa-solid fa-plus"></i>
          </button>
          <div className={styles.counter_container}>
            <div
              className={styles.item_quantity_counter}
              onClick={toggleActive}
            >
              {`${props.item.quantity}pcs`}
            </div>
          </div>
          <button
            className={styles.substract}
            onClick={() => adjustQuantity(-1)}
          >
            <i className="fa fa-solid fa-minus" aria-hidden="true"></i>
          </button>
        </div>{" "}
      </div>
    </div>
  );
}
function RenameBox(props: any) {
  const activeList = useAppSelector(getActiveList);
  const [tempName, setTempName] = useState("");
  useEffect(() => {
    if (activeList) {
      setTempName(activeList.name);
    }
  }, [activeList]);
  function handleSubmit() {
    if (activeList && activeList.id) {
      updateShoppingListName(tempName, activeList);
      props.toggle(ActiveDialog.closeList);
    } else {
      alert("NOT IMPLEMENTED");
    }
  }

  return (
    <section id={styles.input_box_container}>
      <div className={styles.input_box}>
        {" "}
        <input
          type="text"
          className={styles.input_box_form}
          placeholder="Enter a name"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
        />
        <button className={styles.input_button} onClick={handleSubmit}>
          Save
        </button>
      </div>{" "}
    </section>
  );
}

function MarkClosedBox() {
  const activeList = useAppSelector(getActiveList);
  function handleSubmit(status: Status) {
    activeList
      ? updateShoppingListStatus(status, activeList)
      : alert("NOT IMPLEMENTED");
  }
  return (
    <section id={styles.input_box_container} className="">
      <button
        className={styles.finish_cancel}
        onClick={() => handleSubmit(Status.Cancelled)}
      >
        Cancel
      </button>
      <button
        className={styles.finish_complete}
        onClick={() => handleSubmit(Status.Completed)}
      >
        Complete
      </button>
    </section>
  );
}

ShoppingList.defaultProps = {};

ShoppingList.propTypes = {};

export default ShoppingList;
