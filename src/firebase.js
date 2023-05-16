import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
        apiKey: "AIzaSyDq1wd26R-dzsOuVn3ZOM-abB1ciwEfQ3s",
        authDomain: "insta-a5169.firebaseapp.com",
        projectId: "insta-a5169",
        storageBucket: "insta-a5169.appspot.com",
        messagingSenderId: "765062703835",
        appId: "1:765062703835:web:5d2ef5b7f6463d2ce57afe",
        measurementId: "G-FZ7ZC8RQTX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
export { auth };
export default db;
