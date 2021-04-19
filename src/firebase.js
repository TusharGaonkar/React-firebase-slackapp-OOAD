import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyAgIZWEa-RLjZOiqdruRwPgpK91wNAHDhw",
    authDomain: "ooad-react-firebase-chatapp.firebaseapp.com",
    projectId: "ooad-react-firebase-chatapp",
    storageBucket: "ooad-react-firebase-chatapp.appspot.com",
    messagingSenderId: "511288506008",
    appId: "1:511288506008:web:25fb23150efbd2063602ed",
    measurementId: "G-MCH4Z4602Y"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  export default firebase;