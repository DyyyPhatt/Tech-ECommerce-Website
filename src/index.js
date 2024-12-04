import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId="99750422196-cp0va3lft8pindu7u759jj0dg46jbkkt.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
