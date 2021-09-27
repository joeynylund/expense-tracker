import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

const config = {
  apiKey: "AIzaSyBYTYGJStTAKKx7OPNa-bbxXki3xxmnen4",
  authDomain: "expense-tracker-c9a19.firebaseapp.com",
  projectId: "expense-tracker-c9a19",
  storageBucket: "expense-tracker-c9a19.appspot.com",
  messagingSenderId: "937248710857",
  appId: "1:937248710857:web:35c3ca1755af92af2cad18",
  measurementId: "G-CBELWZ6NB4"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

export { firebase, auth, firestore, analytics };