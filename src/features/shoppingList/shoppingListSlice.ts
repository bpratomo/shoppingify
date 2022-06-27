/////////////////////////////////////////////////////////////////////////////
//REDUX PART
/////////////////////////////////////////////////////////////////////////////
import { ItemType } from "../item/itemSlice";

enum Status {
  Open,
  Completed,
  Cancelled,
}
export interface ShoppingListType {
  id?: String;
  name: String;
  status: Status;
  items: ItemToBuy[];
}

export interface ItemToBuy {
  item: ItemType;
  quantity: Number;
}

/////////////////////////////////////////////////////////////////////////////
//REDUX PART
/////////////////////////////////////////////////////////////////////////////

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";

export interface ShoppingListState {
  ShoppingLists: ShoppingListType[];
}

const initialState: ShoppingListState = {
  ShoppingLists: [],
};

export const ShoppingListSlice = createSlice({
  name: "ShoppingList",
  initialState,
  reducers: {
    addShoppingList: (state, action: PayloadAction<ShoppingListType>) => {
      state.ShoppingLists.push(action.payload);
    },

    removeShoppingList: (state, action: PayloadAction<ShoppingListType>) => {
      state.ShoppingLists.filter((i) => i != action.payload);
    },
  },
});

export const { addShoppingList, removeShoppingList } =
  ShoppingListSlice.actions;
const dispatch = useAppDispatch();

/////////////////////////////////////////////////////////////////////////////
//FIRESTORE PART
/////////////////////////////////////////////////////////////////////////////

import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { useAppSelector, useAppDispatch } from "../../app/hooks";

export async function createNewShoppingList(shoppingList: ShoppingListType) {
  try {
    await addDoc(collection(getFirestore(), "ShoppingLists"), {
      name: shoppingList.name,
      status: shoppingList.status,
      items: shoppingList.items,
    });
  } catch (error) {
    console.error(error);
  }
}

function loadShoppingLists() {
  const relevantShoppingListsQuery = query(
    collection(getFirestore(), "ShoppingLists"),
    orderBy("timestamp", "desc")
  );

  onSnapshot(relevantShoppingListsQuery, function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      let shoppingList = <ShoppingListType>change.doc.data();
      if (change.type === "removed") {
        dispatch(removeShoppingList(shoppingList));
      } else if (change.type === "added") {
        dispatch(addShoppingList(shoppingList));
      }
    });
  });
}

loadShoppingLists();
