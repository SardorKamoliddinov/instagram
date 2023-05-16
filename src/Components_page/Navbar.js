import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import db, { auth } from "../firebase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import "./../App.css";
import { BiHomeAlt2 } from "react-icons/bi";
import { MdStorage } from "react-icons/md";


import { PersonIcon, PlusCircleIcon, SignOutIcon, HomeIcon, FaHome } from "@primer/octicons-react";
import "./Navbar_page_scss/navbar.css"

import DialogTitle from "@mui/material/DialogTitle";
import { useStateValue } from "../StateProvider";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
function Navbar() {
  const [{ user }, dispatch] = useStateValue();
  const [openMenu, setOpenMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [caption, setCaption] = useState("");
  const navigate = useNavigate();
  const logOut = function(e) {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        dispatch({
          type: "SET_USER",
          user: null,
        });
        navigate("/login");
      })
      .catch((err) => alert(err));
  };

  const createPost = function(e){
    e.preventDefault();
    addDoc(collection(db, "posts"), {
      caption,
      imageURL,
      userName: user?.userName,
      photoURL: user?.photoURL === null ? "./user.png" : user?.photoURL,
      timeStamp: serverTimestamp(),
    });
    alert("Post created 🚀");
    setCaption("");
    setImageURL("");
    setOpenDialog(false);
  };
  return (
    <div className="navbar">
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create a Post</DialogTitle>
        <DialogContent>
          <div className="Build_post_form">
            <div className="Input_box">
              <input
                type="text"
                placeholder="ImageURL"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />

              <textarea
                type="text"
                placeholder="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                />

              </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="Buttons">
            <button
              className="for_cancel_button"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </button>
            <button className="for_post_button" onClick={createPost}>
              Post
            </button>
          </div>
        </DialogActions>
      </Dialog>
      <div className="Logo">
        <Link to="/">
        <img  src="./logo_image.png" alt="" />
        </Link>
      </div>
      <div className="search_input">
        <input type="text" placeholder="Search ..." />
      </div>
      <div className="Icons">
        <div className="Ico">
        <Link to="/">
        <BiHomeAlt2 className="home" size={30}/>
        </Link>
        </div>
        <div className="Icon">
        <MdStorage onClick={() => setOpenDialog(true)} className="home" size={30}/>
        </div>
        <div className="Icon">
          <img
            src={user?.photoURL === null ? "./person.png" : user?.photoURL}
            alt=""
            onClick={() => setOpenMenu(!openMenu)}
          />
          <Menu openMenu={openMenu} className="Menu1">
            <div className="MenuElement" onClick={() => navigate("/profile")}>
              <PersonIcon/> Profile
            </div>
            <div className="MenuElement" onClick={logOut}><SignOutIcon/> Logout</div>
          </Menu>
        </div>
      </div>
    </div>
  );
}


const Menu = styled.div`
position: relative;
bottom: -8px;
display: ${(props) => (props.openMenu ? "block" : "none")};
background: #fff;
width: 100px;
border: 1px solid lightgray;
border-radius: 5px;
`;

export default Navbar;
