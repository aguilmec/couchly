import { getDocs, updateDoc, collection, doc, addDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';
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

const editName = document.querySelector('.edit-name');
const editPrice = document.querySelector('.edit-price');
const editType = document.querySelector('.edit-type');
const editDescription = document.querySelector('.edit-description');
const editImage = document.querySelector('.edit-image');
const editMake = document.querySelector('.edit-image');
const confirmName = document.querySelector('.confirm-name');
const confirmPrice = document.querySelector('.confirm-price');
const confirmType = document.querySelector('.confirm-type');
const confirmDescription = document.querySelector('.confirm-description');
const confirmImage = document.querySelector('.confirm-image');
const confirmMake = document.querySelector('.confirm-image');

editName.addEventListener('click',(event)=>{event.preventDefault();showInput('name')});
editPrice.addEventListener('click',(event)=>{event.preventDefault();showInput('price')});
confirmName.addEventListener('click',(event)=>{event.preventDefault();updateField('name')});

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

async function updateField(field){
    await updateDoc(docRef, {[field]: document.getElementById(`update-${field}-input`).value}).then(()=>{console.log('Document updated successfully')}).catch((error)=>{console.log(error)})
}

const colRef = collection(db, 'products');
let data = [];
let docRef = '';

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

function showInput(input){
    document.getElementById(`edit-${input}`).style.display = 'none';
    document.getElementById(`confirm-${input}`).style.display = 'flex';
    document.getElementById(`update-${input}-input`).style.display = 'flex';
    document.getElementById(`product-${input}`).style.display = 'none';
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
    docRef = doc(db, 'products', value);
    updateButton.style.display = 'flex';
    cancelButton.style.display = 'flex';
    /*const product = data.filter((product)=>{
        if(product.id === value){
            return true;
        };
    })[0];*/
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
        price: parseFloat(createProductForm['product-price-input'].value),
        type: createProductForm['product-type-input'].value,
        image: createProductForm['product-image-input'].value,
        make: createProductForm['product-make-input'].value,
    };
    await addDoc(colRef, product)
          .then(()=>{console.log('Product created')})
          .catch((error)=>{console.log(error)});
};

/*<p class="input-tag">Product's name: </p>
        <input id="update-name-input" class="name-input" type="text" placeholder="Product's name">
        <p class="input-tag">Product's description: </p>
        <input id="update-description-input" class="description-input" type="text" placeholder="Product's description">
        <p class="input-tag">Product's price: </p>
        <input id="update-price-input" class="price-input" type="text" placeholder="Product's price">
        <p class="input-tag">Product's type: </p>
        <input id="update-type-input" class="type-input" type="text" placeholder="Product's type">
        <p class="input-tag">Product's image: </p>
        <input id="update-image-input" class="image-input" type="text" placeholder="Product's image url">
        <p class="input-tag">Product's make: </p>
        <input id="update-make-input" class="make-input" type="text" placeholder="Product's make">
        <div class="submit-button-container">
            <button class="update-button">Update Product</button>
            <button class="cancel-button">Cancel</button>
        </div>
*/