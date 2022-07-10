import React, { useState, useEffect } from "react";
import "./App.css";
import ItemList from "./pages/ItemList";
import { Sidebar } from "./components/Sidebar";
import ShoppingList from "./pages/ShoppingList";
import { AddItem } from "./pages/AddItem";
import { ItemType, getItems, initializeItems } from "./features/item/itemSlice";
import {
  getActiveList,
  getShoppingLists,
  initializeShoppingLists,
  setActiveList,
} from "./features/shoppingList/shoppingListSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { initializeActiveListItems } from "./features/activeList/activeListSlice";

function App() {
  enum ActiveSidebar {
    AddItem,
    ShoppingList,
  }

  const [counter, setCounter] = useState(0);
  const [activeSidebar, setActiveSidebar] = useState<ActiveSidebar>(
    ActiveSidebar.ShoppingList
  );

  function activateAddItem() {
    setActiveSidebar(ActiveSidebar.AddItem);
  }

  function activateShoppingList() {
    setActiveSidebar(ActiveSidebar.ShoppingList);
  }
  const activeList = useAppSelector(getActiveList);

  const shoppingLists = useAppSelector(getShoppingLists);
  useEffect(() => {
    if (!activeList && shoppingLists) {
      console.log("init triggered");
      const idList = shoppingLists
        .filter((s) => s.id !== undefined)
        .flatMap((s) => s.id);
      if (idList[0]) {
        dispatch(setActiveList(idList[0]));
      }
    }
  }, [shoppingLists]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (counter === 0) {
      initializeItems(dispatch);
      initializeShoppingLists(dispatch);
    }
  }, []);
  useEffect(() => {
    if (activeList) {
      console.log("changed active list triggered!!");
      initializeActiveListItems(dispatch, activeList.id ? activeList.id : "");
    }
  }, [activeList]);

  return (
    <div className="App">
      <Sidebar />
      <ItemList />
      {activeSidebar === ActiveSidebar.AddItem && (
        <AddItem activateShoppingList={activateShoppingList} />
      )}
      {activeSidebar === ActiveSidebar.ShoppingList && (
        <ShoppingList activateAddItem={activateAddItem} />
      )}{" "}
    </div>
  );
}

export default App;
