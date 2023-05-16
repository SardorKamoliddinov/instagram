import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "./../firebase";
import { useStateValue } from "./../StateProvider";
import "./Login_page_scss/login.css";
function Login_page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [{}, dispatch] = useStateValue();
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(function(userCredential){
        const newUser = {
          userName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          email: userCredential.user.email,
          uid: userCredential.user.uid,
        };

        dispatch({
          type: "SET_USER",
          user: newUser,
        });

        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/");
      })
      .catch((err) => alert(err));
  };
  return (
    <div className="Huge_Container">
      <div> 
          <div className="Forms" >

          <div className="logo">
            <img src="./instagram-text-logo.png" alt="" />
          </div>

          <div className="InputBox">
            <input
              type="email"
              placeholder="Enter your email address, please!"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input className="input"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              />
          <button onClick={login}>Log In</button>
            </div>


          </div>

        
          <div className="SignUpBox">
          <p>
            Do not have an account?
            <span onClick={() => navigate("/signup")}> Sign Up</span>
          </p>
          </div>
      </div>
    </div>
  );
}



export default Login_page;
