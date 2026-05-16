
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyArS8fYEf0okadlkcyWolFTuLJYY2MRbpc",
    authDomain: "project2-coffeeshop.firebaseapp.com",
    projectId: "project2-coffeeshop",
    storageBucket: "project2-coffeeshop.firebasestorage.app",
    messagingSenderId: "828798896442",
    appId: "1:828798896442:web:64c2040d709b84db1fa803",
    measurementId: "G-SSXGZ7HWZT"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export {auth , db}