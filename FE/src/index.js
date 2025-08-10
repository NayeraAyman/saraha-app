import React from "react";
import ReactDOM from "react-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
// 393174427210-pilqrg1hp7mikju9p5mcnqqmrs5bcal8.apps.googleusercontent.com
const clientId =
  "896886277689-nsn1k78rcgc6jpu7bciuf6thd51sdg7e.apps.googleusercontent.com";

ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById("root")
);
