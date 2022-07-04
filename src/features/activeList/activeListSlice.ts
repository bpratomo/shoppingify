import {
  Status,
  ShoppingListType,
  ItemToBuy,
} from "../shoppingList/shoppingListSlice";
//
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";

/////////////////////////////////////////////////////////////////////////////
//REDUX PART
/////////////////////////////////////////////////////////////////////////////
export interface ActiveListState {
  activeList: ShoppingListType;
}

const initialState: ActiveListState = {
  activeList: {
    id: "",
    name: "",
    status: Status.Open,
    items: [],
  },
};

export const activeListSlice = createSlice({
  name: "activeList",
  initialState,
  reducers: {
    changeActiveList: (state, action: PayloadAction<ShoppingListType>) => {
      state.activeList = action.payload;
    },

    addItem: (state, action: PayloadAction<ItemToBuy>) => {
      state.activeList.items.push(action.payload);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.activeList.items.filter((i) => i.id !== action.payload);
    },

    updateItem: (state, action: PayloadAction<ItemToBuy>) => {
      const updatedItems = state.activeList.items.map((i) =>
        i.id === action.payload.id ? action.payload : i
      );
      state.activeList.items = updatedItems;
    },
  },
});

export const { changeActiveList, addItem, removeItem, updateItem } =
  activeListSlice.actions;

export const getActiveList = (state: RootState) => state.activeList.activeList;

export default activeListSlice.reducer;

/////////////////////////////////////////////////////////////////////////////
//FIRESTORE PART
/////////////////////////////////////////////////////////////////////////////
export async function fsCreateNewItemToBuy(
  shoppingListId: string,
  item: ItemToBuy
) {
  try {
    const collRef = collection(
      getFirestore(),
      "ShoppingLists",
      shoppingListId,
      "items"
    );
    await addDoc(collRef, item);
  } catch (error) {
    console.error(error);
  }
}

export async function fsUpdateItem(shoppingListId: string, item: ItemToBuy) {
  try {
    if (item.id) {
      const docRef = doc(
        getFirestore(),
        "ShoppingLists",
        shoppingListId,
        "items",
        item.id
      );

      await updateDoc(docRef, { item });
    } else {
      alert("Item not valid");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function fsDeleteItem(shoppingListId: string, item: ItemToBuy) {
  try {
    if (item.id) {
      const docRef = doc(
        getFirestore(),
        "ShoppingLists",
        shoppingListId,
        "items",
        item.id
      );

      await deleteDoc(docRef);
    } else {
      alert("Item not valid");
    }
  } catch (e) {
    console.error(e);
    /* handle error */
  }
}
export function initializeActiveList(dispatch: any, activeListId: string) {
  // console.log("triggered init");
  const relevantItemsQuery = query(
    collection(db, "ShoppingLists", activeListId, "items")
  );
  //
  //     name: "Avocado",
  //     category: "Fruits and Vegetables",
  //     note: "Tasty!",
  //     imageUrl:
  //       "https://media.istockphoto.com/photos/half-of-fresh-ripe-avocado-isolated-on-white-background-picture-id1278032327?k=20&m=1278032327&s=612x612&w=0&h=y8W1WkUJ_EKrJnx6wRSEiY8ruegFxsSOaliKU0ju6z0=",
  //   };

  // createNewItem(testItem);

  const unsubscribe = onSnapshot(relevantItemsQuery, function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      let item = <ItemToBuy>change.doc.data();
      console.log(change.doc.data());
      item.id = change.doc.id;
      console.log(item);
      if (change.type === "removed") {
        dispatch(removeItem(item.id));
      }
      if (change.type === "added") {
        dispatch(addItem(item));
      }
      if (change.type === "modified") {
        dispatch(updateItem(item));
      }
    });
  });
  return unsubscribe;
}
