/////////////////////////////////////////////////////////////////////////////
//MODELING
/////////////////////////////////////////////////////////////////////////////
import { ItemType } from "../item/itemSlice";

import { db } from "../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

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
  createdDate: string;
}

export interface ItemToBuy {
  id?: string;
  item: ItemType;
  quantity: number;
}

/////////////////////////////////////////////////////////////////////////////
//REDUX PART
/////////////////////////////////////////////////////////////////////////////
export interface ShoppingListState {
  ShoppingLists: ShoppingListType[];
  activeListId: string;
  activeList: ShoppingListType | undefined;
}

const initialState: ShoppingListState = {
  ShoppingLists: [],
  activeListId: "",
  activeList: undefined,
};

export const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    addShoppingList: (state, action: PayloadAction<ShoppingListType>) => {
      state.ShoppingLists.push(action.payload);
    },

    removeShoppingList: (state, action: PayloadAction<ShoppingListType>) => {
      state.ShoppingLists.filter((i) => i !== action.payload);
    },

    updateShoppingList: (state, action: PayloadAction<ShoppingListType>) => {
      const updatedShoppingLists = state.ShoppingLists.map((s) =>
        s.id === action.payload.id ? action.payload : s
      );
      return {
        ...state,
        ShoppingLists: updatedShoppingLists,
        activeList:
          state.activeListId === action.payload.id
            ? action.payload
            : state.activeList,
      };
    },

    setActiveList: (state, action: PayloadAction<string>) => {
      const activeList = state.ShoppingLists.filter(
        (s) => s.id === action.payload
      )[0];
      return {
        ...state,
        activeListId: action.payload,
        activeList: activeList,
      };
    },
  },
});

export const {
  addShoppingList,
  removeShoppingList,
  setActiveList,
  updateShoppingList,
} = shoppingListSlice.actions;

export const getActiveList = (state: RootState) =>
  state.shoppingList.activeList;

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
      createdDate: shoppingList.createdDate,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function fsUpdateShoppingList(
  shoppingListId: string,
  shoppingList: ShoppingListType
) {
  try {
    const docRef = doc(getFirestore(), "ShoppingLists", shoppingListId);
    await updateDoc(docRef, {
      name: shoppingList.name,
      status: shoppingList.status,
      items: shoppingList.items,
    });
  } catch (e) {
    /* handle error */
    console.error(e);
  }
}

export async function updateShoppingListName(
  newName: string,
  previousShoppingList: ShoppingListType
) {
  const newShoppingList = {
    ...previousShoppingList,
    name: newName,
  };
  fsUpdateShoppingList(previousShoppingList.id || "", newShoppingList);
}

export async function updateShoppingListStatus(
  newStatus: Status,
  previousShoppingList: ShoppingListType
) {
  const newShoppingList = {
    ...previousShoppingList,
    status: newStatus,
  };
  fsUpdateShoppingList(previousShoppingList.id || "", newShoppingList);
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

  //   const sampleShoppingList: ShoppingListType = {
  //     name: "Test Shopping list",
  //     items: [],
  //     status: Status.Open,
  //     createdDate: new Date().toUTCString(),
  //   };

  // createNewShoppingList(sampleShoppingList);
  console.log(relevantShoppingListsQuery);
  const unsubscribe = onSnapshot(
    relevantShoppingListsQuery,
    function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        let rawShoppingList = change.doc.data() as ShoppingListType;
        console.log(rawShoppingList.createdDate);
        rawShoppingList.id = change.doc.id;
        let shoppingList = {
          ...rawShoppingList,
          createdDate: change.doc.data().createdDate.toDate().toString(),
        };

        console.log(shoppingList);
        if (change.type === "removed") {
          dispatch(removeShoppingList(shoppingList));
        }
        if (change.type === "added") {
          dispatch(addShoppingList(shoppingList));
        }
        if (change.type === "modified") {
          dispatch(updateShoppingList(shoppingList));
        }
      });
    }
  );
  return unsubscribe;
}
