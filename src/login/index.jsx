import React, { useState, useCallback } from "react";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";
import "./index.css";
import { ReactComponent as Google } from "../assets/svgs/google.svg";
import { ReactComponent as Facebook } from "../assets/svgs/facebook.svg";
import { db, firebaseApp } from "../firebase";
import { useHistory } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const auth = getAuth(firebaseApp);
  const history = useHistory();

  const googleOAuth = useCallback(async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      localStorage.setItem("user", JSON.stringify(user));
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
          role: "student",
        });
      }
      history.push("/");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }, [auth, history]);

  const login = useCallback(async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", JSON.stringify(res.user));
      history.push("/");
    } catch (err) {
      console.error(err);
      alert("Wrong password or email");
    }
  }, [auth, email, history, password]);

  return (
    <>
      <div class="iphones">
        <div class="iphone">
          <header class="header">
            <h1>Log in</h1>
          </header>

          <main class="main">
            <div>
              <p>Log in with one of the following options.</p>
              <ul class="buttons">
                <li>
                  <div class="button button--full" onClick={googleOAuth}>
                    <Google height="25" width="25" />
                  </div>
                </li>
                <li>
                  <div class="button button--full">
                    <Facebook height="25" width="25" />
                  </div>
                  <span
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      display: "block",
                    }}
                  >
                    * Coming soon *
                  </span>
                </li>
              </ul>
            </div>

            <div style={{ gap: 30, display: "flex", flexDirection: "column" }}>
              <div class="form__field">
                <label class="form__label" for="email">
                  Email
                </label>
                <input
                  id="email"
                  class="form__input"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div class="form__field">
                <label class="form__label" for="password">
                  Password
                </label>
                <input
                  id="password"
                  class="form__input"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div class="form__field" style={{ marginTop: 15 }}>
                <button
                  class="button button--full button--primary"
                  onClick={login}
                >
                  Log in
                </button>
              </div>
            </div>

            <div class="text--center">
              <p>
                Don't have an account? <a href="/sign-up">Sign up</a>
              </p>
            </div>
          </main>
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <symbol id="icon-apple" viewBox="0 0 24 24">
          <path d="M22 17.607c-.786 2.28-3.139 6.317-5.563 6.361-1.608.031-2.125-.953-3.963-.953-1.837 0-2.412.923-3.932.983-2.572.099-6.542-5.827-6.542-10.995 0-4.747 3.308-7.1 6.198-7.143 1.55-.028 3.014 1.045 3.959 1.045.949 0 2.727-1.29 4.596-1.101.782.033 2.979.315 4.389 2.377-3.741 2.442-3.158 7.549.858 9.426zm-5.222-17.607c-2.826.114-5.132 3.079-4.81 5.531 2.612.203 5.118-2.725 4.81-5.531z"></path>
        </symbol>

        <symbol id="icon-google" viewBox="0 0 24 24">
          <path
            d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </symbol>

        <symbol id="icon-arrow-left" viewBox="0 0 24 24">
          <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
        </symbol>
      </svg>
    </>
  );
};
