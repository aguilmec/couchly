const productsButton = document.getElementById('nav-bar-products');
const homeButton = document.getElementById('home-button');
const aboutButton = document.getElementById('about-button');

productsButton.addEventListener('click', ()=>{navigateToPage('products')});
homeButton.addEventListener('click', ()=>{navigateToPage('index')});
aboutButton.addEventListener('click', ()=>{navigateToPage('about')});

function navigateToPage(string){
    window.location.href = `/Couchly/${string}.html`;
}