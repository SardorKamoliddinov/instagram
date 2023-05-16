import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useStateValue } from "../StateProvider";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "./../firebase";
import Navbar from "./Navbar";
import "./../App.css";
import "./Profile_page_scss/profile.css"

function Profile1() {
  const [{ user }] = useStateValue();
  const [allPost, setAllPost] = useState([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(
        collection(db, "posts"),
        where("userName", "==", user?.userName)
      );

      const querySnapshot = await getDocs(q);

      setAllPost(querySnapshot.docs);
    };

    fetchPosts();
  });
  return (
    <Container>
      <Navbar />
      <Main>
        <div className="Profile_user">
          <div >
            <img className="user_avatar"
              src={user?.photoURL === null ? "./person.png" : user?.photoURL}
              alt=""
            />
          </div>
          
          <h1 className="name">{user?.userName}</h1>
          <div>
          <span className="for_count"><span className="first_number"> 1 </span> {count} <span className="end_number">0</span></span>
                  <button className="added_number" onClick={() => setCount(count + 1)}>
                    Follow
                  </button>
          </div>
        </div>
        <div className="PostContainer">
          {allPost.map((post) => (
            <div className="img">
              <img src={post.data().imageURL} alt="" />
            </div>
          ))}
          
        </div>
      </Main>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  margin-top: 80px;
`;

const Main = styled.main`
  margin: auto;
  height: fit-content;
  padding: 10px;
  max-width: 935px;
  z-index: -100;
`;

export default Profile1;
