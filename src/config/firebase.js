import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

const config = {
  apiKey: "*",
  authDomain: "expense-tracker-c9a19.firebaseapp.com",
  projectId: "expense-tracker-c9a19",
  storageBucket: "expense-tracker-c9a19.appspot.com",
  messagingSenderId: "*",
  appId: "*",
  measurementId: "*"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

export { firebase, auth, firestore, analytics };
