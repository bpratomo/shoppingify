/////////////////////////////////////////////////////////////////////////////
//MODELING
/////////////////////////////////////////////////////////////////////////////
import { ItemType } from "../item/itemSlice";

import { db } from "../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";

export enum Status {
  Open = "OPEN",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
}
export interface ShoppingListType {
  id?: string;
  name: string;
  status: Status;
  items: ItemToBuy[];
}

export interface ItemToBuy {
  id?: string;
  item: ItemType;
  quantity: Number;
}

/////////////////////////////////////////////////////////////////////////////
//REDUX PART
/////////////////////////////////////////////////////////////////////////////
export interface ShoppingListState {
  ShoppingLists: ShoppingListType[];
  activeListId: string;
}

const initialState: ShoppingListState = {
  ShoppingLists: [],
  activeListId: "",
};

export const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    addShoppingList: (state, action: PayloadAction<ShoppingListType>) => {
      state.ShoppingLists.push(action.payload);
    },

    removeShoppingList: (state, action: PayloadAction<ShoppingListType>) => {
      state.ShoppingLists.filter((i) => i != action.payload);
    },

    setActiveList: (state, action: PayloadAction<string>) => {
      state.activeListId = action.payload;
    },
  },
});

export const { addShoppingList, removeShoppingList, setActiveList } =
  shoppingListSlice.actions;

export const getActiveListId = (state: RootState) =>
  state.shoppingList.activeListId;

export const getShoppingLists = (state: RootState) =>
  state.shoppingList.ShoppingLists;

export default shoppingListSlice.reducer;

/////////////////////////////////////////////////////////////////////////////
//FIRESTORE PART
/////////////////////////////////////////////////////////////////////////////
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

export async function addNewItemInShoppingList(
  shoppingListId: string,
  itemToAdd: ItemToBuy
) {
  try {
    const collectionRef = collection(
      getFirestore(),
      "ShoppingLists",
      shoppingListId,
      "items"
    );
    await addDoc(collectionRef, itemToAdd);
  } catch (error) {
    console.error(error);
  }
}

export function initializeShoppingLists(dispatch: any) {
  const relevantShoppingListsQuery = query(collection(db, "ShoppingLists"));

  const sampleShoppingList: ShoppingListType = {
    name: "Test Shopping list",
    items: [],
    status: Status.Open,
  };

  // createNewShoppingList(sampleShoppingList);
  console.log(relevantShoppingListsQuery);
  const unsubscribe = onSnapshot(
    relevantShoppingListsQuery,
    function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        let shoppingList = <ShoppingListType>change.doc.data();
        shoppingList.id = change.doc.id;
        console.log(shoppingList);
        if (change.type === "removed") {
          dispatch(removeShoppingList(shoppingList));
        } else if (change.type === "added") {
          dispatch(addShoppingList(shoppingList));
        }
      });
    }
  );
  return unsubscribe;
}
