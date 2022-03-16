import React, { useState, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useHistory, Link } from "react-router-dom";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";

import { db, firebaseApp } from "../../firebase";
import { ReactComponent as Google } from "../../assets/svgs/google.svg";
import { ReactComponent as Facebook } from "../../assets/svgs/facebook.svg";
import "../index.css";

export const SignUp = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState({
    confirmPassword: "",
    error: "",
  });
  const auth = getAuth(firebaseApp);
  const history = useHistory();
  const [recaptcha, setRecaptcha] = useState(false);

  const googleOAuth = useCallback(async () => {
    if (recaptcha) {
      const googleProvider = new GoogleAuthProvider();
      try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        localStorage.setItem("user", JSON.stringify(res.user));
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

  const register = useCallback(async () => {
    if (recaptcha) {
      try {
        if (password !== confirmPassword) {
          setConfirmPassword((prev) => ({
            ...prev,
            error: "Passwords do not match.",
          }));
        } else {
          const res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = res.user;
          localStorage.setItem("user", JSON.stringify(res.user));
          setConfirmPassword((prev) => ({
            ...prev,
            error: "",
          }));
          await addDoc(collection(db, "users"), {
            uid: user.uid,
            authProvider: "local",
            email: email,
            role: "student",
          });
          history.push("/");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong, please retry later.");
      }
    } else {
      alert("Please confirm you are not a robot.");
    }
  }, [recaptcha, email, password, confirmPassword, auth, history]);

  const onRecaptchaChange = (value) => {
    if (value) {
      setRecaptcha(true);
    } else {
      setRecaptcha(false);
    }
  };

  return (
    <div class="iphones">
      <div class="iphone">
        <header class="header">
          <h1>Sign up</h1>
        </header>

        <main class="main">
          <div>
            <p>Sign up with one of the following options.</p>
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
                min="6"
                type="password"
                placeholder="Pick a strong password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div class="form__field">
              <label class="form__label" for="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                class="form__input"
                name="confirm-password"
                min="6"
                type="password"
                placeholder="Confirm strong password"
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              />
              {confirmPassword.error && (
                <span style={{ color: "red" }}>{confirmPassword.error}</span>
              )}
            </div>
            <div className="googleRechapchaV2">
              <ReCAPTCHA
                sitekey="6LetRNkeAAAAAA4d-oDTLNqIf9waaD-4fI9dUpAg"
                onChange={onRecaptchaChange}
                theme={"dark"}
                size={"compact"}
              />
            </div>
          </div>

          <div class="form__field">
            <button
              class="button button--full button--primary"
              onClick={register}
              style={{ marginTop: 15 }}
            >
              Create Account
            </button>
          </div>

          <div class="text--center">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
