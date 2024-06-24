import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { RotatingLines } from "react-loader-spinner";
import { logInUser, setFavoriteMedia, setLoading } from "../../store/userSlice";
import { fetchFavoriteMediaFromFirestore } from "../../firestore";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

import "./style.scss";
import SwitchTabs from "../../components/switchTabs/SwitchTabs";

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [firebaseEmailErr, setFirebaseEmailErr] = useState("");
  const [firebasePassErr, setFirebasePassErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [logInErrMsg, setLogInErrMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const handleLogIn = async () => {
    dispatch(setLoading(true));
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch(
        logInUser({
          userData: {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
          },
        })
      );
      const favoriteMedia = await fetchFavoriteMediaFromFirestore(user.uid);
      dispatch(setFavoriteMedia(favoriteMedia));
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      setLogInErrMsg("Your Email or password is not correct! Try again.");
      setEmail("");
      setPassword("");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSignUp = async () => {
    dispatch(setLoading(true));
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: username });

      dispatch(setLoading(false));
      setSuccessMsg("Account created Successfully!");
      setTimeout(() => {
        setSelectedTab(0);
        setEmail("");
        setPassword("");
        setSuccessMsg("");
        setFirebaseEmailErr("");
      }, 3000);
    } catch (error) {
      const errorCode = error.code;
      console.error("Error signing up:", error);
      if (errorCode.includes("auth/email-already-in-use")) {
        setFirebaseEmailErr("Email already in use, try another one!");
        setUsername("");
        setEmail("");
        setPassword("");
      }
      if (errorCode.includes("auth/weak-password")) {
        setFirebasePassErr("Password should be at least 6 characters!");
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleTabChange = (tab, index) => {
    setSelectedTab(index);
    setUsername("");
    setEmail("");
    setPassword("");
    setSuccessMsg("");
    setLogInErrMsg("");
    setFirebaseEmailErr("");
    setFirebasePassErr("");
  };

  useEffect(() => {
    setIsLogin(selectedTab === 0);
  }, [selectedTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await handleLogIn();
    } else {
      await handleSignUp();
    }
  };

  return (
    <div className="logInSection">
      <div className="login-form">
        <div className="switchContainer">
          <SwitchTabs
            data={["Log in", "Sign up"]}
            onTabChange={handleTabChange}
            selectedTab={selectedTab}
          />
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {firebaseEmailErr && (
            <span className="firebaseError">{firebaseEmailErr}</span>
          )}
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {firebasePassErr && (
            <span className="firebaseError">{firebasePassErr}</span>
          )}
          {isLogin && (
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          )}
          <button type="submit">{isLogin ? "Login" : "Signup"}</button>
          {user.isLoading && (
            <div className="rotatingSpinner">
              <RotatingLines
                visible={true}
                width="50"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
          {successMsg && (
            <div className="successMsg">
              <p>{successMsg}</p>
            </div>
          )}
          {logInErrMsg && (
            <div className="errorMsg">
              <p>{logInErrMsg}</p>
            </div>
          )}
        </form>
        {isLogin ? (
          <div className="signup-prompt">
            Not a member?{" "}
            <span onClick={() => handleTabChange("Signup", 1)}>Signup now</span>
          </div>
        ) : (
          <div className="signup-prompt">
            Already a member?{" "}
            <span onClick={() => handleTabChange("Login", 0)}>Login now</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogIn;
