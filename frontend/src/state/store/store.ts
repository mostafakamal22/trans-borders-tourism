import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import thunk from "redux-thunk";
import adminAuthReducer from "../features/admin/auth/adminAuthSlice";

const persistConfig = {
  key: "root",
  storage,
  //encrypting state being stored in localstorage
  transforms: [
    encryptTransform({
      secretKey: "transborderstourism20222",
      onError: function (error) {
        // Handle the error.
        console.log(error);
      },
    }),
  ],
};

const appReducer = combineReducers({
  adminAuth: adminAuthReducer,
});

//All Logout actions
const logoutActions = ["auth/admin/logout"];

//remove All Stored state in local storage when logging out
const rootReducer = (state: any, action: any) => {
  if (logoutActions.includes(action.type)) {
    // for all keys defined in your persistConfig(s)
    storage.removeItem("persist:root");
    // storage.removeItem('persist:otherKey')

    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
