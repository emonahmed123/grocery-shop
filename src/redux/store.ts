import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/cart/cartSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistCartConfig = {
  key: "cart",
  storage,
};

const persistedUserReducer = persistReducer(persistCartConfig, cartSlice);
export const store = configureStore({
  reducer: {
    cart: persistedUserReducer,
  },
});
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
