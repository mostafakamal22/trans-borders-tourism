import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import thunk from "redux-thunk";
import adminAuthReducer from "../features/admin/auth/adminAuthSlice";
import invoiceReducer from "../features/invoice/invoiceSlice";
import passportReducer from "../features/passport/passportSlice";
import visaReducer from "../features/visa/visaSlice";
import paymentReducer from "../features/payment/paymentSlice";
import ticketReducer from "../features/ticket/ticketSlice";
import purchaseReducer from "../features/purchase/purchaseSlice";
import bankReducer from "../features/bank/bankSlice";

const persistConfig = {
  key: "root",
  storage,
  //encrypting state being stored in localstorage
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_REDUX_PERSIST_KEY,
      onError: function (error) {
        // Handle the error.
        console.log(error);
      },
    }),
  ],
};

const appReducer = combineReducers({
  adminAuth: adminAuthReducer,
  invoiceData: invoiceReducer,
  passportsData: passportReducer,
  visasData: visaReducer,
  paymentsData: paymentReducer,
  ticketsData: ticketReducer,
  purchasesData: purchaseReducer,
  banksData: bankReducer,
});

//All Logout actions
const logoutActions = [
  "auth/admin/logout",
  "admins/logout",
  "passports/logout",
  "visas/logout",
  "payments/logout",
  "tickets/logout",
  "Purchases/logout",
  "banks/logout",
];

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
