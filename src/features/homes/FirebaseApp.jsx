// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCJg6iVF91qFvAMFgbiXOdnl_pOTG84uqc",
	authDomain: "con-world.firebaseapp.com",
	projectId: "con-world",
	storageBucket: "con-world.appspot.com",
	messagingSenderId: "121867385996",
	appId: "1:121867385996:web:98fb60c8c3054d2eba8fa9",
	measurementId: "G-5XG0DW1F5L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
