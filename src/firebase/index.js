// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


//firebase congif files for obvious reasons I will not be sharing mine

// // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: "chatapp-679b7",
    storageBucket: "chatapp-679b7.appspot.com",
    messagingSenderId: "1093427911843",
    appId: "1:1093427911843:web:080b6c6e4bd2f41477f316"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;