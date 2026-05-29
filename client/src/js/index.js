import {getProductList} from './get-product.js';

document.addEventListener("DOMContentLoaded" , () => {
    const productContainer = document.querySelector('.product-list');
    getProductList(4,productContainer);

} )