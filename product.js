import { doc, getDocs, getDoc, collection } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { db } from "./firebase.js";

const productImage = document.querySelector('.image-container-product');
const productMake = document.querySelector('.product-maker');
const productDescription = document.querySelector('.product-description');
const productPrice = document.querySelector('.product-price');
const homeButton = document.getElementById('home-button');
const productsButton = document.getElementById('products-button');
const productName = document.querySelector('.product-name');

homeButton.addEventListener('click',()=>{navigateToPage('index')});
productsButton.addEventListener('click',()=>{navigateToPage('products')});

const productId = window.location.search.slice(1);
const docRef = doc(db, 'products',productId);

let product = {};

async function getProduct(productId){
    product = await getDoc(docRef)
                    .then((response)=>{
                        product = response.data();
                        updateProduct(product);
                    });
};

function navigateToPage(string){
    window.location.href = `/${string}.html`;
};

function updateProduct(product){
    productImage.innerHTML = `<img class="product-image" src="${product.image}">`;
    productMake.innerHTML = product.make;
    productDescription.innerHTML = product.description;
    productPrice.innerHTML = product.price;
    productName.innerHTML = product.name;
}

getProduct(productId);

