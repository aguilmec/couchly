import { getDocs, getDoc, collection } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { db } from "./firebase.js";

const colRef = collection(db,'products');

const productsButton = document.getElementById('nav-bar-products');
const homeButton = document.getElementById('home-button');
const aboutButton = document.getElementById('about-button');
const priceSlider = document.querySelector('.price-slider');
const priceTag = document.getElementById('sidebar-price');
const filtersContainer = document.querySelector('.filters-container');
const productGrid = document.querySelector('.product-grid');
const chairFilter = document.getElementById('chair-filter');
const tableFilter = document.getElementById('table-filter');
const sofaFilter = document.getElementById('sofa-filter');
const closetFilter = document.getElementById('closet-filter');
const coffeeTableFilter = document.getElementById('coffee-table-filter');
const allFilter = document.getElementById('all-filter');
const cartNumber = document.querySelector('.number-of-items');
const cartButton = document.querySelector('.cart');
const cart = document.querySelector('.side-cart');
const cartGrid = document.querySelector('.cart-grid');
const closeButton = document.querySelector('.close-button');
const cartTotal = document.querySelector('.cart-total');

productsButton.addEventListener('click', ()=>{navigateToPage('products')});
homeButton.addEventListener('click', ()=>{navigateToPage('index')});
aboutButton.addEventListener('click', ()=>{navigateToPage('about')});
priceSlider.addEventListener('change',()=>{changePrice()});
chairFilter.addEventListener('click', ()=>{filterByType('chair')});
tableFilter.addEventListener('click', ()=>{filterByType('table')});
sofaFilter.addEventListener('click', ()=>{filterByType('sofa')});
closetFilter.addEventListener('click', ()=>{filterByType('closet')});
coffeeTableFilter.addEventListener('click', ()=>{filterByType('coffee table')});
allFilter.addEventListener('click', ()=>{filterByType('all')});
cartButton.addEventListener('click', ()=>{showCart(true)});
closeButton.addEventListener('click',()=>{showCart(false)});

let makers = [];
let cartItems = [];
let data = [];
let total = 0;


//Get data from firebase
getDocs(colRef)
.then((response)=>{response.docs.forEach((document)=>{
    data.push({...document.data(), id: document.id});
    if(!makers.includes(document.data().make)){
        makers.push(document.data().make);
    }
});
    updateFilters();
    updateGrid(data);
    localStorage.setItem('data',JSON.stringify(data));
})
.catch((error)=>{console.log(error.message)});

//Function that shows/hides cart
function showCart(value){
    if(value){
        cart.style.display = 'flex';
    }else{
        cart.style.display = 'none';
    };
};

//Function that takes an array and updates the filter elements on the page
function updateFilters(){
    let value = `<a value = "all" class="sidebar-button">All</a>`;
    makers.forEach(maker => {
        value = value + `<a value = "${maker}" class="sidebar-button">${maker}</a>`
        filtersContainer.innerHTML = value;
    });
    const filters = document.querySelectorAll('.sidebar-button');
    filters.forEach(filter => {
        filter.addEventListener('click',()=>{
            filterByMake(filter.innerHTML);
        });
    });
};

//Function that filtes by product type, takes as argument the product type
function filterByType(type){
    let newData = [];
    if(type !== 'all'){
        newData = data.filter((product)=>{
            if(product.type === type){
                return true;
            };
        });
    }else{
        newData = data;

    } ;
    updateGrid(newData);
};

//Function that filters products based on the selected filter.
function filterByMake(make){
    let newData = [];
    if(make !== 'All'){
        newData = data.filter((product)=>{
            if(product.make === make){
                return true;
            };
        });
        updateGrid(newData);
    }else{
        updateGrid(data);
    };
};

updateFilters();

//Page navigation
function navigateToPage(string){
    window.location.href = `/${string}.html`;
};

//Function that changes the price of the price tag element based on the selected value on the slider
function changePrice(){
    priceTag.innerHTML = `Price: $${priceSlider.value}`;
};

//Function that add itemt to cart
function addItemToCart(itemID){
    let a = data.filter((item)=>{if(item.id === itemID){return true}})
    cartItems.push(a[0]);
    updateCartNumber(true);
    updateCart(cartItems);
};

//Function that updates the number of cart items
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
    }
    
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

function removeItem(id){
    let price = 0;
    cartItems = cartItems.filter((item)=>{
        if(item.id !== id){
            return true;
        };
    });
    updateCart(cartItems);
    updateCartNumber(false);
}

//Function that updates grid
function updateGrid(data){
    let products = '';
    data.forEach((product)=>{
        products = products + `<div class="product">
        <div class="image-container-product">
            <div class="product-modal">
                <button class="add-cart-product" value = "${product.id}">
                    <span class="material-symbols-outlined">add_shopping_cart</span>
                </button>
                <button class="search-button-product" value = "${product.id}">
                    <span class="material-symbols-outlined">search</span>
                </button>
            </div>
            <img class="product-image" src="${product.image}" alt = "${product.name}">
        </div>
        <div class="bottom-container-product">
            <button class="product-name" value = "${product.id}">
                ${product.name}
            </button>
            <p class="product-price">
                ${product.price}
            </p>
        </div>
    </div>`
    });
    productGrid.innerHTML = products;
    const addCartButtonList = document.querySelectorAll('.add-cart-product');
    addCartButtonList.forEach((button)=>{
        button.addEventListener('click', ()=>{addItemToCart(button.value)});
    });

    const searchButtonList = document.querySelectorAll('.search-button-product');
    searchButtonList.forEach((button)=>{
        button.addEventListener('click',()=>{gotoProduct(button.value)})
    })

    const gotoProductButtons = document.querySelectorAll('.product-name');
    gotoProductButtons.forEach((button)=>{
        button.addEventListener('click', ()=>{gotoProduct(button.value)})
    });
};

function gotoProduct(id){
    window.location.href = `product.html?${id}`;
};

updateGrid(data);

/*
[{name:"Comfy Chair",price:58.99,make:"Ikea",type:"chair",image:"https://www.ikea.com/us/en/images/products/ekeroe-armchair-skiftebo-dark-blue__0815338_pe772866_s5.jpg?f=s",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et magna purus. Vestibulum mauris eros, convallis scelerisque pharetra ac, vehicula ac tortor. Mauris auctor condimentum felis sed pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis vel.",id:"DN1HxAvKwAN7luii4Gtk"},
            {make:"Ikea",name:"Cozy Chair",price:111.8,type:"chair",image:"https://www.ikea.com/gb/en/images/products/strandmon-wing-chair-tallmyra-dark-green__0840456_pe647272_s5.jpg?f=s",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et magna purus. Vestibulum mauris eros, convallis scelerisque pharetra ac, vehicula ac tortor. Mauris auctor condimentum felis sed pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis vel.",id:"ElNu4y3J4z77sTulZIBw"},
            {"price":154.76,"type":"table","image":"https://media.karousell.com/media/photos/products/2023/3/8/ikea_table_and_chairs_for_sale_1678237351_b13c6905_progressive.jpg","make":"Couchly","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et magna purus. Vestibulum mauris eros, convallis scelerisque pharetra ac, vehicula ac tortor. Mauris auctor condimentum felis sed pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis vel.",name:"Cozy Dinning Table",id:"NhCb2P4mhXBuu1zvhfeR"},
            {type:"chair",name:"Modular Chair",make:"Ikea",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et magna purus. Vestibulum mauris eros, convallis scelerisque pharetra ac, vehicula ac tortor. Mauris auctor condimentum felis sed pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis vel.",image:"https://www.ikea.com/ie/en/range-categorisation/images/sofa-modules-31786.jpeg?imwidth=500",price:99.99,id:"UT71dyUQ6bcqU1p66H40"},
            {name:"Luxurious Sofa",type:"sofa",image:"https://www.ikea.com/cl/es/images/products/landskrona-sofa-3-cuerpos-gunnared-gris-verdoso__0826895_pe680192_s5.jpg?f=s",price:440.29,description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et magna purus. Vestibulum mauris eros, convallis scelerisque pharetra ac, vehicula ac tortor. Mauris auctor condimentum felis sed pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis vel.",make:"Donatello",id:"duXaI47ELiVKOHljQAlu"},
            {make:"Ikea",image:"https://www.ikea.com/cl/es/images/products/landskrona-sofa-3-cuerpos-chaiselongue-gunnared-gris-oscuro__0825455_pe680320_s5.jpg?f=s",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et magna purus. Vestibulum mauris eros, convallis scelerisque pharetra ac, vehicula ac tortor. Mauris auctor condimentum felis sed pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis vel.",name:"Comfortable Living room Sofa",type:"couch",price:200,id:"fEf4VfMLveTstA83dhPR"},
            {type:"other",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et magna purus. Vestibulum mauris eros, convallis scelerisque pharetra ac, vehicula ac tortor. Mauris auctor condimentum felis sed pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis vel.",name:"Modular Dinning Room Set",price:315.09,make:"Couchly",image:"https://www.ikea.com/es/es/images/products/besta-mueble-salon-lappviken-stubbarp-sindvik-vidrio-transparente-negro-marron__0979799_pe814712_s5.jpg?f=s",id:"kDCgGNngNcDT8Gxt0C7T"},
            {name:"Cozy Leather Couch",type:"couch",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et magna purus. Vestibulum mauris eros, convallis scelerisque pharetra ac, vehicula ac tortor. Mauris auctor condimentum felis sed pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis vel.",make:"Donatello",image:"https://www.ikea.com/sa/en/images/products/landskrona-3-seat-sofa-grann-bomstad-golden-brown-metal__0825420_pe680179_s5.jpg?f=s",price:354.99,id:"xDIuOj6SjJUFY7ymMtnw"},
            {name:"Modular Closet",type:"closet",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam et magna purus. Vestibulum mauris eros, convallis scelerisque pharetra ac, vehicula ac tortor. Mauris auctor condimentum felis sed pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac felis vel.",make:"Couchly",image:"https://www.estiloydeco.com/wp-content/uploads/2020/02/muebles-modulares-ikea-10.jpg",price:70,id:"xGHb0oiXgmEu5U1UAoRJ"}];


<div class="product-grid">
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                        </div>
                        <img class="product-image" src="./chair2.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./chair1.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./closet1.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./coffee3.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./table2.jpeg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./table1.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./chair2.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./chair1.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./closet1.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./coffee3.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./table2.jpeg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./table1.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./chair2.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./chair1.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./closet1.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./coffee3.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./table2.jpeg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
                <div class="product">
                    <div class="image-container-product">
                        <div class="product-modal">
                            <button class="add-cart-product">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                            <button class="search-button-product">
                                <span class="material-symbols-outlined">add_shopping_cart</span>
                            </button>
                        </div>
                        <img class="product-image" src="./table1.jpg">
                    </div>
                    <div class="bottom-container-product">
                        <p class="product-name">
                            Ergonomic Office Chair
                        </p>
                        <p class="product-price">
                            $542.99
                        </p>
                    </div>
                </div>
            </div>
            */