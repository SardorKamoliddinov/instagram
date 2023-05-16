import React, { useEffect, useState } from "react";

import { useStateValue } from "./../StateProvider";
import styled from "styled-components";
import Navbar from "./Navbar";
import Post from "./Post";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import db from "./../firebase";
import "./Home_page_scss/Home.css"
function Home_page() {
  const [{ user }] = useStateValue();
  const [allPost, setAllPost] = useState([]);

  useEffect(function(){
    const fetchposts = function() {
      const q = query(collection(db, "posts"), orderBy("timeStamp", "desc"));

      onSnapshot(q, (snapshots) => {
        setAllPost(snapshots.docs);
      });
    };

    fetchposts();
  });

  return (
    <Container>
      <Navbar />
      <div className="Card">
        <div className="Master">
          <div className="Posted">
            {allPost.map((post) => (
              <Post
                userName={post.data().userName}
                photoURL={post.data().photoURL}
                caption={post.data().caption}
                imageURL={post.data().imageURL}
                postID={post.id}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div``;
export default Home_page;
