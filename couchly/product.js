import { doc, getDocs, getDoc, collection } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { db } from "./firebase.js";

const productImage = document.querySelector('.image-container-product');
const productMake = document.querySelector('.product-maker');
const productDescription = document.querySelector('.product-description');
const productPrice = document.querySelector('.product-price');
const homeButton = document.getElementById('home-button');
const productsButton = document.getElementById('products-button');
const productName = document.querySelector('.product-name');
const loader = document.querySelector('.loader');
const productContainer = document.querySelector('.product-info-container');
const cartButton = document.querySelector('.cart');
const closeButton = document.querySelector('.close-button');
const cart = document.querySelector('.side-cart');
const addToCart = document.querySelector('.add-to-cart');
const cartNumber = document.querySelector('.number-of-items');
const cartGrid = document.querySelector('.cart-grid');
const cartTotal = document.querySelector('.cart-total');

homeButton.addEventListener('click',()=>{navigateToPage('index.html')});
productsButton.addEventListener('click',()=>{navigateToPage('products/products.html')});
cartButton.addEventListener('click',()=>{showCart(true)});
closeButton.addEventListener('click',()=>{showCart(false)});

const productId = window.location.search.split('?')[2];
const col = window.location.search.split('?')[1];
const docRef = doc(db, col, productId);

let product = {};
let cartItems = [];
let loading = true;
let total = 0;

productContainer.style.display = 'none';

async function getProduct(){
    
    product = await getDoc(docRef)
                    .then(response=>{
                        loader.style.display = 'none';
                        productContainer.style.display = 'grid';
                        product = {...response.data(), id: response.id};                
                        addToCart.addEventListener('click',()=>{addItemToCart(response.id, {...response.data(), id: response.id})})
                        updateProduct(product);
                    });
};

function navigateToPage(string){
    window.location.href = `/${string}`;
};

function updateProduct(product){
    productImage.innerHTML = `<img class="product-image" src="${product.image}">`;
    productMake.innerHTML = product.make;
    productDescription.innerHTML = product.description;
    productPrice.innerHTML = `$${product.price}`;
    productName.innerHTML = product.name;
    addToCart.value = product.id;
};

function updateCartNumber(type){
    let value = Number(cartNumber.innerHTML);
    if(type){
        if(value === 0){
            cartNumber.style.display = 'flex';
            cartNumber.style.textAlign = 'center';
            cartNumber.style.justifyContent = 'center';
            value += 1;
            cartNumber.innerHTML = value;
        }else{
            value += 1;
            cartNumber.innerHTML = value;
            cartNumber.style.display = "bock";
        };
    }else{
        if(value === 0){
            cartNumber.style.display = "none";
        }else{
            value -= 1;
            cartNumber.innerHTML = value;
        };
    };
    
};

function addItemToCart(itemID, product){
    console.log(product);
    cartItems.push(product);
    updateCartNumber(true);
    updateCart(cartItems);
};


function updateCart(items){
    let cartItems = '';
    total = 0;
    items.forEach((item)=>{
        total = total + item.price;
        cartItems = cartItems + `<div class="cart-item">
        <img class="cart-image" src="${item.image}">
        <div class="cart-item-container">
            <p class="item-name">
                ${item.name}
            </p>
            <p class="item-price">
                $${item.price}
            </p>
            <button value = "${item.id}" class="remove-item">
                Remove
            </button>
        </div>
        <div class="cart-buttons">
            <button class="cart-button">
                +
            </button>
            <button class="cart-button">
                -
            </button>
        </div>
    </div>`;
    });
    cartGrid.innerHTML = cartItems;
    cartTotal.innerHTML = `Total: $${total}`;

    const removeButtonsList = document.querySelectorAll('.remove-item');
    removeButtonsList.forEach((button)=>{
        button.addEventListener('click',()=>{removeItem(button.value)});
    });
};

function showCart(value){
    if(value){
        cart.style.display = 'flex';
    }else{
        cart.style.display = 'none';
    };
};

function removeItem(id){
    cartItems = cartItems.filter((item)=>{
        if(item.id !== id){
            return true;
        };
    });
    updateCart(cartItems);
    updateCartNumber(false);
};

getProduct();

