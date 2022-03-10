import React from "react";
import "./App.css";

import { CssBaseline, createMuiTheme, ThemeProvider } from "@material-ui/core";

import { Routes } from "../route/index";
// import PageHeader from "../components/PageHeader";
// import { db } from "../firebase";
// import {
//   collection,
//   //   onSnapshot,
//   //   serverTimestamp,
//   //   addDoc,
//   //   getDoc,
//   getDocs,
// } from "firebase/firestore";

// import { useEffect } from "react";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#333996",
      light: "#3c44b126",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    background: {
      default: "#f4f5fd",
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: "translateZ(0)",
      },
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
});

function App() {
  //   const todoRef = collection(db, "test");
  //   useEffect(() => {
  //     (async () => {
  //       let all = await getDocs(todoRef);
  //       all.forEach((doc) => {
  //         // doc.data() is never undefined for query doc snapshots
  //         console.log(doc.id, " => ", doc.data());
  //       });
  //       //   await addDoc(collection(db, "test"), {
  //       //     id: 2,
  //       //   });
  //     })();
  //   }, [todoRef]);
  return (
    <ThemeProvider theme={theme}>
      <Routes />
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
