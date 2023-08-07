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

function navigateToPage(string){
    window.location.href = `/Couchly/${string}.html`;
}