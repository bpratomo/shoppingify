/////////////////////////////////////////////////////////////////////////////
//IMPORTS
/////////////////////////////////////////////////////////////////////////////
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { RootState, AppThunk, store } from "../../app/store";
import {
  documentId,
  where,
  doc,
  addDoc,
  getDoc,
  deleteDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  DocumentData,
} from "firebase/firestore";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { db } from "../firebase/firebaseConfig";

////////////////////////////////////////////////////////////////////////////
//MODELING PART
/////////////////////////////////////////////////////////////////////////////

export interface ItemType {
  id?: string;
  category: string;
  name: string;
  note: string;
  imageUrl: string;
}

export interface ItemListState {
  items: ItemType[];
}

/////////////////////////////////////////////////////////////////////////////
//REDUX PART
/////////////////////////////////////////////////////////////////////////////
const initialState: ItemListState = {
  items: [],
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ItemType>) => {
      state.items.push(action.payload);
    },

    removeItem: (state, action: PayloadAction<ItemType>) => {
      state.items.filter((i) => i.id != action.payload.id);
    },
    updateItem: (state, action: PayloadAction<ItemType>) => {
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? action.payload : i
        ),
      };
    },
  },
});

export const { addItem, removeItem, updateItem } = itemSlice.actions;

export const getItems = (state: RootState) => state.item.items;

export default itemSlice.reducer;

//////////////////////////////////////////////////////////////////////////////
//Interop
/////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//FIRESTORE PART
/////////////////////////////////////////////////////////////////////////////

export async function createNewItem(item: ItemType) {
  try {
    await addDoc(collection(db, "items"), {
      name: item.name,
      category: item.category,
      note: item.note,
      imageUrl: item.imageUrl,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteItem(docId: string) {
  try {
    const docRef = doc(db, "items", docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(error);
  }
}

export function initializeItems(dispatch: any) {
  console.log("triggered init");
  const relevantItemsQuery = query(collection(db, "items"));
  //
  //     name: "Avocado",
  //     category: "Fruits and Vegetables",
  //     note: "Tasty!",
  //     imageUrl:
  //       "https://media.istockphoto.com/photos/half-of-fresh-ripe-avocado-isolated-on-white-background-picture-id1278032327?k=20&m=1278032327&s=612x612&w=0&h=y8W1WkUJ_EKrJnx6wRSEiY8ruegFxsSOaliKU0ju6z0=",
  //   };

  // createNewItem(testItem);

  onSnapshot(relevantItemsQuery, function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      let item = <ItemType>change.doc.data();
      console.log(change.doc.data());
      item.id = change.doc.id;
      console.log(item);
      if (change.type === "removed") {
        dispatch(removeItem(item));
      }
      if (change.type === "added") {
        dispatch(addItem(item));
      }
      if (change.type === "modified") {
        dispatch(updateItem(item));
      }
    });
  });
}
