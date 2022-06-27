import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBIrrgAzyfpEtbi-kUYdiunHt2ruAA6Nqk",

  authDomain: "shoppingify-14918.firebaseapp.com",

  projectId: "shoppingify-14918",

  storageBucket: "shoppingify-14918.appspot.com",

  messagingSenderId: "393673304947",

  appId: "1:393673304947:web:77b469de7e0e0b7e833306",

  measurementId: "G-YKFPF8WHLS",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export var db = getFirestore(app);
