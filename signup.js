import { onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { db, auth } from "./firebase.js";

const signupForm = document.querySelector('.signup-form')
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const signupButton = document.querySelector('.signup-button');
const errorMessageEmail = document.querySelector('.email-error-message');


onAuthStateChanged(auth, (user)=>{
    if(user){
        console.log('mierdaaaaa');
        console.log(user)
    }else{
        console.log('no');
    };
});

/*signupButton.addEventListener('click', ()=>{
    const user = {
        email: emailInput.value,
        password: passwordInput.value
    };
    signUp(user);
});*/

signupForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const user = {
        email: signupForm['email-input'].value,
        password: signupForm['password-input'].value
    };
    signUp(user);
});

function checkEmail(email){
    if(email.length < 1 || !email.includes('@')){
        errorMessageEmail.innerHTML = 'Please enter a valid e-mail';
        setTimeout(()=>{errorMessageEmail.innerHTML = ''},2000);
    }else{
        return true;
    };
};

function checkPassword(password){
    if(password.len < 9){
        console.log('error');
    };
};

function signUp(user){
    const { email, password } = user;
    if(checkEmail(email)){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error)=>{
            console.log(error)
        });
    };
    signupForm.reset();
    
};