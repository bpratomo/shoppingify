import React, { useState, useEffect } from "react";
import "./App.css";
import ItemList from "./pages/ItemList";
import { Sidebar } from "./components/Sidebar";
import ShoppingList from "./pages/ShoppingList";
import { AddItem } from "./pages/AddItem";
import { ItemDesc } from "./pages/ItemDesc";
import { ItemType, getItems, initializeItems } from "./features/item/itemSlice";
import {
  getActiveList,
  getShoppingLists,
  initializeShoppingLists,
  ItemToBuy,
  setActiveList,
} from "./features/shoppingList/shoppingListSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { initializeActiveListItems } from "./features/activeList/activeListSlice";

function App() {
  enum ActiveSidebar {
    AddItem,
    ShoppingList,
    ItemDesc,
  }

  const activeList = useAppSelector(getActiveList);
  const shoppingLists = useAppSelector(getShoppingLists);

  const [counter, setCounter] = useState(0);
  const [activeSidebar, setActiveSidebar] = useState<ActiveSidebar>(
    ActiveSidebar.ShoppingList
  );

  const [activeItem, setActiveItem] = useState<ItemType>();

  function activateAddItem() {
    setActiveSidebar(ActiveSidebar.AddItem);
  }

  function activateShoppingList() {
    setActiveSidebar(ActiveSidebar.ShoppingList);
  }

  function activateItemDesc(i: ItemType) {
    setActiveItem(i);
    setActiveSidebar(ActiveSidebar.ItemDesc);
  }

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (counter === 0) {
      initializeItems(dispatch);
      initializeShoppingLists(dispatch);
    }
  }, []);

  useEffect(() => {
    if (shoppingLists.length > 0 && !activeList) {
      const withId = shoppingLists.filter((s) => (s.id ? true : false));
      if (withId[0].id) {
        dispatch(setActiveList(withId[0].id));
        initializeActiveListItems(dispatch, withId[0].id);
      }
    }
  }, [shoppingLists]);

  return (
    <div className="App">
      <Sidebar />
      <ItemList activateItemDesc={activateItemDesc} />
      {activeSidebar === ActiveSidebar.AddItem && (
        <AddItem activateShoppingList={activateShoppingList} />
      )}
      {activeSidebar === ActiveSidebar.ItemDesc && activeItem && (
        <ItemDesc
          item={activeItem}
          activateShoppingList={activateShoppingList}
        />
      )}
      {activeSidebar === ActiveSidebar.ShoppingList && (
        <ShoppingList activateAddItem={activateAddItem} />
      )}{" "}
    </div>
  );
}

export default App;
