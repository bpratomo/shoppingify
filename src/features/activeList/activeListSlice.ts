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
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { ItemType } from "../item/itemSlice";

/////////////////////////////////////////////////////////////////////////////
//REDUX PART
/////////////////////////////////////////////////////////////////////////////
export interface ActiveListItemsState {
  ActiveListItems: ItemToBuy[];
}

const initialState: ActiveListItemsState = {
  ActiveListItems: [],
};

export const ActiveListItemsSlice = createSlice({
  name: "ActiveListItems",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ItemToBuy>) => {
      state.ActiveListItems.push(action.payload);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.ActiveListItems.filter((i) => i.id !== action.payload);
    },

    updateItem: (state, action: PayloadAction<ItemToBuy>) => {
      const updatedItems = state.ActiveListItems.map((i) =>
        i.id === action.payload.id ? action.payload : i
      );
      state.ActiveListItems = updatedItems;
    },
  },
});

export const { addItem, removeItem, updateItem } = ActiveListItemsSlice.actions;

export const getActiveListItems = (state: RootState) =>
  state.activeListItems.ActiveListItems;

export default ActiveListItemsSlice.reducer;

/////////////////////////////////////////////////////////////////////////////
//FIRESTORE PART
/////////////////////////////////////////////////////////////////////////////

export async function fsAddNewItem(shoppingListId: string, item: ItemToBuy) {
  const checkExistQuery = query(
    collection(db, "ShoppingLists", shoppingListId, "items")
  );
  const docs = await getDocs(checkExistQuery);
  const docMatch = docs.docs.filter(
    (d) => d.data().item.name === item.item.name
  );
  let docRef;
  let previousQuantity;

  let newItem;
  if (docMatch.length === 0) {
    fsCreateNewItemToBuy(shoppingListId, item);
  } else {
    docRef = docMatch[0];
    previousQuantity = docRef.data().quantity;
    newItem = {
      id: docRef.id,
      item: docRef.data().item,
      quantity: previousQuantity + 1,
    };
    fsUpdateItem(shoppingListId, <ItemToBuy>newItem);
  }
}
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

      await updateDoc(docRef, {
        item: item.item,
        quantity: item.quantity,
      });
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
export function initializeActiveListItems(dispatch: any, activeListId: string) {
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
      let itemToBuy = <ItemToBuy>change.doc.data();
      let item = <ItemType>itemToBuy.item;
      console.log(change.doc.data());
      itemToBuy.id = change.doc.id;
      itemToBuy.item = item;
      console.log(itemToBuy);
      if (change.type === "removed") {
        dispatch(removeItem(itemToBuy.id));
      }
      if (change.type === "added") {
        dispatch(addItem(itemToBuy));
      }
      if (change.type === "modified") {
        dispatch(updateItem(itemToBuy));
      }
    });
  });
  return unsubscribe;
}
