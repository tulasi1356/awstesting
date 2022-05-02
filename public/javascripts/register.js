// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkPLvjnUlYzjl8PmT3U1zD2vlZf5H-I-0",
  authDomain: "darwinboxproject-5f126.firebaseapp.com",
  projectId: "darwinboxproject-5f126",
  storageBucket: "darwinboxproject-5f126.appspot.com",
  messagingSenderId: "709134356880",
  appId: "1:709134356880:web:a280dc6872f15cb3c8a315",
  measurementId: "G-PLN53GE7KF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log(firebase,'ppppppppppppp')