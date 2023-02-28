import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./assets/styles/index.css";
import { store } from "./state/store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

//Disable React Dev Tool At Production.
if (import.meta.env.MODE === "production") {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
