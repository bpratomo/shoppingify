import React, { useState, useEffect } from "react";
import "./App.css";
import ItemList from "./pages/ItemList";
import { Sidebar } from "./components/Sidebar";
import ShoppingList from "./pages/ShoppingList";
import { ItemType, getItems, initializeItems } from "./features/item/itemSlice";
import { initializeShoppingLists } from "./features/shoppingList/shoppingListSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";

function App() {
  const [counter, setCounter] = useState(0);

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (counter === 0) {
      initializeItems(dispatch);
      // setCounter(1);
    }
  }, []);

  return (
    <div className="App">
      <Sidebar />
      <ItemList />
      <ShoppingList />
    </div>
  );
}

export default App;
