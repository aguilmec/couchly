import { signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { db, auth } from "./firebase.js";

const loginForm = document.querySelector('.login-form');
    
onAuthStateChanged(auth, (user)=>{
    if(user){
        console.log(user);
    }else{
        console.log('no');
    }
});

function navigateToPage(page){
    window.location.href = `/${page}.html`;
};

loginForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    const user = {
        email: loginForm['email-input'].value,
        password: loginForm['password-input'].value
    };
    signInWithEmailAndPassword(auth, user.email, user.password)
    .then((userCredential)=>{
        const user = userCredential.user;
        navigateToPage('index');
    })
    .catch((error)=>{
        console.log(error);
    });
});