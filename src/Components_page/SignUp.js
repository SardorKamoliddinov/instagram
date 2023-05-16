import React, { useState } from "react";
import styled from "styled-components";
import {
  query,
  collection,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import db, { auth } from "./../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "./SignUp_page_scss/signup.css"
import { useNavigate } from "react-router-dom";
function SignUp() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const navigate = useNavigate();
  const createAccount = async (e) => {
    e.preventDefault();
    const username_query = await query(
      collection(db, "users"),
      where("userName", "==", userName)
    );

    const username_exists = await getDocs(username_query);

    if (username_exists.docs.length === 0) {
      if (userName.length > 0 && email.length > 0 && password.length > 0) {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            updateProfile(userCredential.user, {
              displayName: userName,
              photoURL: photoURL,
            });

            await setDoc(doc(db, "users", userCredential.user.uid), {
              email,
              userName,
              photoURL,
            });

            setEmail("");
            setPassword("");
            setPhotoURL("");
            setUserName("");
            alert("Your Account is Created");
            navigate("/login");
          })
          .catch((err) => alert(err));
      } else {
        alert("Please fill the inputs");
      }
    } else {
      alert("User Name is Exists");
    }
  };
  return (
    <div className="ContainerBox">
      <div>
        <Form onSubmit={createAccount}>

          <div className="Logo">
            <img src="./instagram-text-logo.png" alt="" />
          </div>
          
          <div className="Form">

          <div className="InputContainer">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <input
              type="text"
              placeholder="PhotoURL (Optional)"
              onChange={(e) => setPhotoURL(e.target.value)}
              value={photoURL}
              />

          <button onClick={createAccount}>Sign Up</button>
            </div>


          </div>
        </Form>

        <div className="LoginContainer">
          <p>
            Have an account ?{" "}
            <span onClick={() => navigate("/login")}>Log In</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const Form = styled.form``;

export default SignUp;
