import React, { useState, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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
import { useHistory, Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const auth = getAuth(firebaseApp);
  const history = useHistory();
  const [recaptcha, setRecaptcha] = useState(false);

  const googleOAuth = useCallback(async () => {
    if (recaptcha) {
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
    } else {
      alert("Please confirm you are not a robot.");
    }
  }, [auth, history, recaptcha]);

  const login = useCallback(async () => {
    if (recaptcha) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("user", JSON.stringify(res.user));
        history.push("/");
      } catch (err) {
        console.error(err);
        alert("Wrong password or email");
      }
    } else {
      alert("Please confirm you are not a robot.");
    }
  }, [auth, email, history, password, recaptcha]);

  const onRecaptchaChange = (value) => {
    if (value) {
      setRecaptcha(true);
    } else {
      setRecaptcha(false);
    }
  };

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
              <div className="googleRechapchaV2">
                <ReCAPTCHA
                  sitekey="6LetRNkeAAAAAA4d-oDTLNqIf9waaD-4fI9dUpAg"
                  onChange={onRecaptchaChange}
                  theme={"dark"}
                  size={"compact"}
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
                Don't have an account?
                <Link to="/sign-up">Sign up</Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
