let orderArray = [];

const addClassicBurgerButtonEl = document.getElementById('addClassicBurgerButton');
const addCheeseBurgerButtonEl = document.getElementById('addCheeseBurgerButton');
const addChickenClubSandwichEl = document.getElementById('addChickenClubSandwich');
const addHamSandwichEl = document.getElementById('addHamSandwich');
const addChickenCaesarWrapEl = document.getElementById('addChickenCaesarWrap');
const addSpicyVeggieWrapEl = document.getElementById('addSpicyVeggieWrap');
const addFrenchFriesEl = document.getElementById('addFrenchFries');
const addOnionRingsEl = document.getElementById('addOnionRings');
const addCheeseFriesEl = document.getElementById('addCheeseFries');
const addChickenNuggetsEl = document.getElementById('addChickenNuggets');

addClassicBurgerButtonEl.addEventListener('click', function() {
    orderArray.push('Classic Burger');
    updateOrderArray();
})

addCheeseBurgerButtonEl.addEventListener('click', function() {
    orderArray.push('Cheese Burger');
    updateOrderArray();
})

addChickenClubSandwichEl.addEventListener('click', function() {
    orderArray.push('Chicken Club Sandwich');
    updateOrderArray();
})

addHamSandwichEl.addEventListener('click', function() {
    orderArray.push('Ham Sandwich');
    updateOrderArray();
})

addChickenCaesarWrapEl.addEventListener('click', function() {
    orderArray.push('Chicken Caesar Wrap');
    updateOrderArray();
})

addSpicyVeggieWrapEl.addEventListener('click', function() {
    orderArray.push('Spicy Veggie Wrap');
    updateOrderArray();
})

addFrenchFriesEl.addEventListener('click', function() {
    orderArray.push('French Fries');
    updateOrderArray();
})

addOnionRingsEl.addEventListener('click', function() {
    orderArray.push('Onion Rings');
    updateOrderArray();
})

addCheeseFriesEl.addEventListener('click', function() {
    orderArray.push('Cheese Fries');
    updateOrderArray();
})

addChickenNuggetsEl.addEventListener('click', function() {
    orderArray.push('Chicken Nuggets');
    updateOrderArray();
})

const cartBadgeEl = document.getElementById("cartBadge");

function updateOrderArray() {
    if (cartBadgeEl) {
        cartBadgeEl.textContent = orderArray.length;
    }
}

const cartEl = document.getElementById('cart')
cartEl.addEventListener('click', function() {
    localStorage.setItem('orderArray', JSON.stringify(orderArray));
    cartBadgeEl.textContent = null
    orderArray = []
})