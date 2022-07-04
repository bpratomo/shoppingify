import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import itemReducer from "../features/item/itemSlice";
import shoppingListReducer from "../features/shoppingList/shoppingListSlice";
import activeListItemReducer from "../features/activeList/activeListSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    item: itemReducer,
    shoppingList: shoppingListReducer,
    activeListItems: activeListItemReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
