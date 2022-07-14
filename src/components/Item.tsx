import { getItems, ItemType } from "../features/item/itemSlice";
import styles from "./Item.module.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  getActiveList,
  ItemToBuy,
} from "../features/shoppingList/shoppingListSlice";
import {
  fsAddNewItem,
  fsCreateNewItemToBuy,
} from "../features/activeList/activeListSlice";

interface ItemProps {
  item: ItemType;
  activateItemDesc: (i: ItemType) => void;
}

function Item(props: ItemProps) {
  const dispatch = useAppDispatch();
  const activeList = useAppSelector(getActiveList);

  function handleItemAdd() {
    const itemToBuy: ItemToBuy = {
      item: props.item,
      quantity: 1,
    };
    if (activeList && activeList.id) {
      fsAddNewItem(activeList.id, itemToBuy);
    } else {
      alert("NOT IMPLEMENTED");
    }
  }

  return (
    <div className={styles.base}>
      <div onClick={() => props.activateItemDesc(props.item)}>
        {props.item.name}
      </div>
      <i className="fas fa-plus" onClick={() => handleItemAdd()}></i>
    </div>
  );
}

export default Item;
