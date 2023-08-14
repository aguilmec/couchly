//import { getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
//import { db } from "./firebase";

const productsButton = document.getElementById('nav-bar-products');
const homeButton = document.getElementById('home-button');
const aboutButton = document.getElementById('about-button');
const shopNowButton = document.querySelector('.modal-button');
const moreProductsButton = document.querySelector('.more-products');

productsButton.addEventListener('click', ()=>{navigateToPage('products')});
homeButton.addEventListener('click', ()=>{navigateToPage('index')});
aboutButton.addEventListener('click', ()=>{navigateToPage('about')});
shopNowButton.addEventListener('click', ()=>{navigateToPage('products')})
moreProductsButton.addEventListener('click', ()=>{navigateToPage('products')})

//colRef = collection(db, 'products');

console.log('mierds')

let featured = [];
/*
getDocs(colRef)
.then((response)=>{
    response.docs.forEach((document) => {
        featured.push({...document.data, id: document.id})        
    });
    updateFeatured();
    console.log(featured);
});

*/

function updateFeatured(){
    console.log('mierda');
};

function navigateToPage(string){
    window.location.href = `couchly/${string}.html`;
};