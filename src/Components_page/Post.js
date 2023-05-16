import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import db from "../firebase";
import { useStateValue } from "./../StateProvider";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";

import "./Post_page_scss/post.css"
function Post({ userName, photoURL, caption, imageURL, postID }) {
  const [moreButton, setMoreButton] = useState(false);
  const [{ user }] = useStateValue();

  const [likesOnPost, setLikesOnPost] = useState({
    likes: [],
  });

  const [likeState, setLikeState] = useState({
    like: likesOnPost?.likes.length > 0 ? likesOnPost?.likes.length : 0,
    likeActive: false,
  });

  const [commentsOnPost, setCommentsOnPost] = useState([]);

  const [commentState, setCommentState] = useState({
    comments: commentsOnPost?.length > 0 ? commentsOnPost?.length : 0,
  });

  const [commentInput, setCommentInput] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const handleLike = async (e) => {
    e.preventDefault();

    if (likesOnPost?.likes.includes(user?.userName)) {
      // dislike Part
      const likePayload = {
        likes: likesOnPost?.likes.filter((likedUser) => {
          return likedUser !== user?.userName;
        }),
      };

      await setDoc(doc(db, "likes", postID), likePayload);

      setLikesOnPost({
        likes: likePayload.likes,
      });
    } else {
      // like Part
      const likePayload = {
        likes: [...likesOnPost.likes, user?.userName],
      };

      setLikesOnPost(likePayload);

      await setDoc(doc(db, "likes", postID), likePayload);

      setLikesOnPost({
        likes: likePayload.likes,
      });
    }
  };

  const getLikes = async () => {
    const docRef = doc(db, "likes", postID);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setLikesOnPost(docSnap.data());
    }

    setLikeState({
      like: docSnap.data()?.likes?.length ? docSnap.data()?.likes?.length : 0,
      likeActive: docSnap.data().likes?.includes(user?.userName) ? true : false,
    });
  };

  useEffect(function() {
    getLikes();
  }, [likeState]);

  const handleComment = async (e) => {
    e.preventDefault();

    if (commentInput.length > 0) {
      let payload = {
        commentInput,
        userName: user?.userName,
        photoURL: user?.photoURL,
        timeStamp: serverTimestamp(),
      };

      const docRef = doc(db, "comments", postID);

      addDoc(collection(docRef, "list"), payload);

      setCommentInput("");
    } else {
      alert("Please Fill up the blank");
    }
  };

  const getComments = async () => {
    const q = query(
      collection(db, "comments", postID, "list"),
      orderBy("timeStamp", "desc")
    );

    onSnapshot(q, (snapshot) => {
      setCommentsOnPost(snapshot.docs);
      setCommentState({
        comments: snapshot.docs.length,
      });
    });
  };

  useEffect(function() {
    getComments();
  }, [commentState]);

  return (
    <selector>
      <div className="Containers">
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <div className="comment">
            {commentsOnPost.map((comment) => (
              <div className="post-comment">
                <div className="for_user_image">
                  <img src={comment.data().photoURL} alt="" />
                </div>
                <div className="for_user_comment">
                  <strong>{comment?.data().userName}</strong>
                  <p>{comment?.data().commentInput}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <div className="UserInformation">
        <img src={photoURL} alt="" />
        <p className="UserName">{userName}</p>
      </div>
      <div className="Content">
        <img src={imageURL} alt="" />
      </div>
      <div className="for_post_CTA">
        <div className="for_CTA_buttons">
          {likeState.likeActive ? (
            <img src="./like_with_color.png" alt="" onClick={handleLike} />
          ) : (
            <img src="./like_without_color.png" alt="" onClick={handleLike} />
          )}
          <img src="./chat234.png" alt="" onClick={() => setOpenDialog(true)} />
        </div>
        <div className="for_like_count">
          <p>{likesOnPost?.likes.length} likes</p>
        </div>
        <div className="for_post_description">
          <h5>{caption}</h5>

          <div className="for_recent_comment">
            <strong>{commentsOnPost[0]?.data().userName}</strong>
            <p>{commentsOnPost[0]?.data().commentInput}</p>
          </div>

          <div className="for_description_buttons">
            <p onClick={() => setOpenDialog(true)}>View all comments</p>
            <p onClick={() => setMoreButton(!moreButton)}>
              {moreButton ? "less" : "more"}
            </p>
          </div>
        </div>
        <div className="for_comment_input">
          <input
            type="text"
            placeholder="Add Comment"
            onChange={(e) => setCommentInput(e.target.value)}
            value={commentInput}
          />
          <button onClick={handleComment}>Post</button>
        </div>
      </div>
      </div>
    </selector>
  );
}

export default Post;
