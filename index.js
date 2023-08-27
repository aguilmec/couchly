import { getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js'
import { db, auth } from "./firebase.js";

const productsButton = document.getElementById('nav-bar-products');
const homeButton = document.getElementById('home-button');
const aboutButton = document.getElementById('about-button');
const shopNowButton = document.querySelector('.modal-button');
const moreProductsButton = document.querySelector('.more-products');
const featuredGrid = document.querySelector('.featured-grid');
const cartButton = document.querySelector('.cart');
const cartGrid = document.querySelector('.cart-grid');
const closeButton = document.querySelector('.close-button');
const cartTotal = document.querySelector('.cart-total');
const cart = document.querySelector('.side-cart');
const cartNumber = document.querySelector('.number-of-items');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');
const profileButton = document.getElementById('profile-button');
const gotoSales = document.getElementById('goto-sales');
const salesGrid = document.querySelector('.sales-grid');
const featuredLoader = document.querySelector('.loader-featured');
const saleLoader = document.querySelector('.loader-sale');

productsButton.addEventListener('click', ()=>{navigateToPage('couchly/products.html?products')});
homeButton.addEventListener('click', ()=>{navigateToPage('couchly/index.html')});
aboutButton.addEventListener('click', ()=>{navigateToPage('couchly/about.html')});
shopNowButton.addEventListener('click', ()=>{navigateToPage('couchly/products.html?products')});
moreProductsButton.addEventListener('click', ()=>{navigateToPage('couchly/products.html?featured')});
cartButton.addEventListener('click',()=>{showCart(true)});
closeButton.addEventListener('click',()=>{showCart(false)});
loginButton.addEventListener('click', ()=>{navigateToPage('couchly/login.html')});
signupButton.addEventListener('click', ()=>{navigateToPage('couchly/signup.html')});
logoutButton.addEventListener('click',()=>{logoutUser()});
gotoSales.addEventListener('click', ()=>{navigateToPage('couchly/products.html?sales')});

const colRef = collection(db, 'featured');
const colRefSales = collection(db, 'sales');

let featured = [];
let sales = [];
let cartItems = [];
let total = 0;
let loading = true;
let loadingSale = true

if (loading === true){
    featuredGrid.style.display = 'none';
    featuredLoader.style.display = 'flex';
};

if (loadingSale === true){
    salesGrid.style.display = 'none';
    saleLoader.style.display = 'flex';
};

onAuthStateChanged(auth, (user)=>{
    if(user){
        signupButton.style.display = 'none';
        logoutButton.style.display = 'flex';
        loginButton.style.display = 'none';
        profileButton.style.display = 'flex';

    }else{
        console.log('no');
    };
});

function logoutUser(){
    signOut(auth);
    location.reload();
};

async function getData(){
    await getDocs(colRef)
    .then((response)=>{
        loading = false;
        featuredGrid.style.display = 'flex';
        featuredLoader.style.display = 'none';
        response.forEach(document => {
            featured.push({...document.data(), id: document.id});
        });
    });
    updateFeatured(featured);
};

async function getSales(){
    await getDocs(colRefSales)
          .then((response)=>{
            loading = false;
            salesGrid.style.display = 'flex';
            saleLoader.style.display = 'none';
            response.forEach((document)=>{
                sales.push({...document.data(), id: document.id})
            });
          }).catch((error)=>{
            console.log(error);
          });
    updateSales(sales);
};

getSales();

function updateSales(sales){
    let salesGridValue = '';
    sales.forEach((document)=>{
        salesGridValue = salesGridValue + `
            <div class="featured-product">
                <div class="image-container-featured">
                    <div class="featured-modal">
                        <button value="${document.id}" class="add-cart-sales">
                            <span class="material-symbols-outlined">add_shopping_cart</span>
                        </button>
                        <button value="${document.id}" class="search-button-sales">
                            <span class="material-symbols-outlined">search</span>
                        </button>
                    </div>
                    <img class="featured-image" src="${document.image}">
                </div>
                <div class="bottom-container-featured">
                    <p class="featured-name">
                        ${document.name}
                    </p>
                    <p class="featured-price">
                        $${document.price}
                    </p>
                </div>
            </div>`
    });

    salesGrid.innerHTML = salesGridValue;

    let buttonsList = document.querySelectorAll('.add-cart-sales');
    buttonsList.forEach((button)=>{
        button.addEventListener('click',()=>{addItemToCart(button.value, sales)});
    });

    buttonsList = document.querySelectorAll('.search-button-sales');
    buttonsList.forEach((button)=>{
        button.addEventListener('click', ()=>{
            navigateToPage(`product.html?sales?${button.value}`)
        });
    });

};

getData();

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

function addItemToCart(itemID, data){
    console.log(data)
    let a = data.filter((item)=>{if(item.id === itemID){return true}})
    cartItems.push(a[0]);
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

function updateFeatured(data){
    let gridElements = '';

    data.forEach((product)=>{
        gridElements = gridElements + `
        <div class="featured-product">
                    <div class="image-container-featured">
                        <div class="featured-modal">
                            <button value="${product.id}" class="add-cart-featured">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                            <button value="${product.id}" class="search-button-featured">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                        </div>
                        <img class="featured-image" src="${product.image}">
                    </div>
                    <div class="bottom-container-featured">
                        <p class="featured-name">
                            ${product.name}
                        </p>
                        <p class="featured-price">
                            $${product.price}
                        </p>
                    </div>
                </div>`
    });

    featuredGrid.innerHTML = gridElements;

    const addToCartButtons = document.querySelectorAll('.add-cart-featured');
    addToCartButtons.forEach((button)=>{
        button.addEventListener('click', ()=>{addItemToCart(button.value, featured)});
    });

    const searchProductButtons = document.querySelectorAll('.search-button-featured');
    searchProductButtons.forEach((button)=>{
        button.addEventListener('click', ()=>{gotoProduct(button.value)});
    });
};

function gotoProduct(value){
    window.location.href = `couchly/product.html?featured?${value}`;
};

function showCart(value){
    if(value){
        cart.style.display = 'flex';
    }else{
        cart.style.display = 'none';
    };
};

function navigateToPage(string){
    window.location.href = `/${string}`;
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