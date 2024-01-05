import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Toast from "./components/Toast";
import {
  GroupProvider,
  LoginProvider,
  MemberProvider,
  ShowPopupProvider,
} from "./context/Provider";
import { GlobalStyle } from "./GlobalStyle";

// dotenv.config();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ShowPopupProvider>
    <LoginProvider>
      <GroupProvider>
        <MemberProvider>
          <GlobalStyle />
          <App />
          <Toast />
        </MemberProvider>
      </GroupProvider>
    </LoginProvider>
  </ShowPopupProvider>
);
