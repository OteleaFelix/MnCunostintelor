import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App/App";
// import { ConnectedRouter } from "connected-react-router";
// import { ReactReduxContext } from "react-redux";
// import { createBrowserHistory } from "history";

import * as serviceWorker from "./serviceWorker";
// ** Create Browser History.
// const history = createBrowserHistory();

ReactDOM.render(
  //   <ConnectedRouter history={history}>
  <App />,
  //   </ConnectedRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
