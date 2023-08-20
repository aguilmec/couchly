import { getDocs, collection, doc, addDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
import { db } from "./firebase.js";

const createProductButton = document.querySelector('.button-create');
const updateProductButton = document.querySelector('.button-update');
const createProductTab = document.querySelector('.create-product-tab');
const submitButton = document.querySelector('.submit-button');
const createProductForm = document.querySelector('.create-product-tab');
const updateProductTab = document.querySelector('.update-product-tab');
const resultsGrid = document.querySelector('.results-grid');
const updateOptions = document.querySelector('.update-options-tab');
const productSearchButton = document.querySelector('.product-search-button');
const searchNameInput = document.querySelector('.product-search-name-input');
const searchMakeInput = document.querySelector('.product-search-make-input');
const searchTypeInput = document.querySelector('.product-search-type-input');
const updateButton = document.querySelector('.update-button');
const cancelButton = document.querySelector('.cancel-button');

createProductButton.addEventListener('click',()=>{showCreateProductTab(true)});
createProductForm.addEventListener('submit',(event)=>{submitProduct(event)});
updateProductButton.addEventListener('click',()=>{showUpdateProduct(true)});
productSearchButton.addEventListener('click',()=>{
    if(searchMakeInput.value){
        getData('make', searchMakeInput.value);
    }else if(searchNameInput.value){
        getData('name', searchNameInput.value);
    }else if(searchTypeInput.value){
        getData('type',searchTypeInput.value);
    }else{
        console.log('no');
    };
});
updateButton.addEventListener('submit',(event)=>{
    event.preventDefault();
});

const colRef = collection(db, 'products');
let data = [];

async function getData(type, value){
    data = [];
    let q ='';
    if(type === 'make'){
        q = query(colRef, where('make','==',value));
    }else if(type === 'name'){
        q = query(colRef, where('name','==',value));
    }else if(type === 'type'){
        q = query(colRef, where('type','==',value));
    };
    
    await getDocs(q)
        .then((snapshot)=>{
        snapshot.forEach((document)=>{
            data.push({...document.data(), id: document.id});
        });
    });
    updateProductGrid(data);
};

function showCreateProductTab(show){
    if(show){
        createProductButton.classList.add('selected-left');
        createProductTab.style.display = 'flex';
        showUpdateProduct(false);
    }else{
        createProductButton.classList.remove('selected-left');
        createProductTab.style.display = 'none';  
    };
};

showCreateProductTab(true);

function updateProductGrid(data){
    let info = '';
    data.forEach((product) => {
        info = info + `
            <div class="product">
                <img class="product-img" src=${product.image}>
                <div class="middle-product-container">
                    <p class="product-name">${product.name}</p>
                    <p class="product-make">${product.make}</p>
                    <p class="product-price">$${product.price}</p>
                </div>
                <div class="right-product-container">
                    <button value="${product.id}" class="edit-product-button">Edit</button>
                </div>
            </div>
        `;
        resultsGrid.innerHTML = info;
    });

    const editButtonsList = document.querySelectorAll('.edit-product-button');
    editButtonsList.forEach((button)=>{
        button.addEventListener('click',()=>{editProduct(button.value)});
    });
};

function editProduct(value){
    updateButton.style.display = 'flex';
    cancelButton.style.display = 'flex';
    const product = data.filter((product)=>{
        if(product.id === value){
            return true;
        };
    })[0];
    resultsGrid.style.display = 'none';
    updateOptions.style.display = 'grid';
};

function showUpdateProduct(show){
    if(show){
        updateProductButton.classList.add('selected-second-left');
        updateProductTab.style.display = 'flex';
        showCreateProductTab(false);
    }else{
        updateProductButton.classList.remove('selected-second-left');
        updateProductTab.style.display = 'none';
    };
};

async function submitProduct(event){
    event.preventDefault();
    const product = {
        name: createProductForm['product-name-input'].value,
        description: createProductForm['product-description-input'].value,
        price: createProductForm['product-price-input'].value,
        type: createProductForm['product-type-input'].value,
        image: createProductForm['product-image-input'].value,
        make: createProductForm['product-make-input'].value,
    };
    await addDoc(colRef, product)
          .catch((error)=>{console.log(error)});
};

