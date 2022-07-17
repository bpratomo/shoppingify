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
  getActiveListId,
  getShoppingLists,
  initializeShoppingLists,
  ItemToBuy,
  setActiveList,
} from "./features/shoppingList/shoppingListSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { initializeActiveListItems } from "./features/activeList/activeListSlice";
import { ShoppingLists } from "./pages/ShoppingLists";
export enum ActivePage {
  ItemList,
  ShoppingLists,
}
function App() {
  enum ActiveSidebar {
    AddItem,
    ShoppingList,
    ItemDesc,
  }

  const activeList = useAppSelector(getActiveList);
  const activeListId = useAppSelector(getActiveListId);
  const shoppingLists = useAppSelector(getShoppingLists);

  const [counter, setCounter] = useState(0);
  const [activeSidebar, setActiveSidebar] = useState<ActiveSidebar>(
    ActiveSidebar.ShoppingList
  );
  const [activePage, setActivePage] = useState<ActivePage>(
    ActivePage.ShoppingLists
  );

  const [activeItem, setActiveItem] = useState<ItemType>();
  const [unsubscribeActiveListItem, setUnsubscribeFn] = useState<() => void>();

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
      }
    }
  }, [shoppingLists]);

  useEffect(() => {
    if (unsubscribeActiveListItem) {
      unsubscribeActiveListItem();
    }
    if (activeListId) {
      initializeActiveListItems(dispatch, activeListId);
    }
  }, [activeListId]);

  return (
    <div className="App">
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      {activePage === ActivePage.ItemList && (
        <ItemList activateItemDesc={activateItemDesc} />
      )}
      {activePage === ActivePage.ShoppingLists && <ShoppingLists />}
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
