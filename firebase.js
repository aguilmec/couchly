// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeubhmusIyH7nY2-qhkc9tTxsdZtcgyhY",
  authDomain: "couchly-b42e3.firebaseapp.com",
  projectId: "couchly-b42e3",
  storageBucket: "couchly-b42e3.appspot.com",
  messagingSenderId: "8145949614",
  appId: "1:8145949614:web:5c6e618495298139bdae3f",
  measurementId: "G-P5CLFZYP9Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//Initialize services
export const db = getFirestore(app);

export const auth = getAuth();


/*

<div class="bottom-top-modal-info">
  Browse our newest bedroom sets
  </div>

<div class="bottom-bottom-modal-info">
  Save up to 65% in couches
</div>

  */