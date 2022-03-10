import React from "react";
import { Route, Switch, Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { makeStyles } from "@material-ui/core";

import Students from "../pages/Students/Students";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { Login } from "../login";
import { SignUp } from "../login/components/index";

// ** Create Browser History.
const history = createBrowserHistory();

const useStyles = makeStyles({
  appMain: {
    paddingLeft: "320px",
    width: "100%",
  },
});

export const Routes = () => {
  const classes = useStyles();
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/sign-up">
          <SignUp />
        </Route>
        <Route path="/">
          <SideMenu />
          <div className={classes.appMain}>
            <Header />
            <Students />
          </div>
        </Route>
      </Switch>
    </Router>
  );
};
