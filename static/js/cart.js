let orderArray = JSON.parse(localStorage.getItem('orderArray')) || [];

prices = {'Classic Burger': 550, 'Cheese Burger': 700, 'Chicken Club Sandwich': 350, 'Ham Sandwich': 450, 'Chicken Caesar Wrap': 650, 'Spicy Veggie Wrap': 700, 'French Fries': 200, 'Onion Rings': 250, 'Cheese Fries': 300, 'Chicken Nuggets': 400}

let orderObject = {};
for (let item of orderArray) {
    orderObject[item] = (orderObject[item] || 0) + 1;
}

const itemsEl = document.getElementById('items');
for (let item in orderObject) {
    let quantity = orderObject[item];
    itemsEl.innerHTML += `
        <div class="item">
            <img class="item-image" src="../static/images/${item}.jpg" alt="${item} image">
            <span class="item-name">${item}</span>
            <span class="item-quantity">x ${quantity}</span>
        </div>
    `;
}

let bill = 0;
for (let item in orderObject) {
    bill += (prices[item] * orderObject[item]);
}
const billEl = document.getElementById('bill');
billEl.textContent += bill;

const submitOrderButtonEl = document.getElementById('submitOrderButton');
const orderSubmissionSectionEl = document.getElementById('orderSubmissionSection');
const mainHeadingEl = document.getElementById('mainHeading')

function generateOrderId() {
    const letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const number = Math.floor(Math.random() * 9999) + 1;
    return letter + number.toString().padStart(4, '0');
}

const orderID = generateOrderId()

const fieldsUnfillMessageEl = document.getElementById('fieldsUnfillMessage')

submitOrderButtonEl.addEventListener('click', function() {
    const personName = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const specialInstructions = document.getElementById('specialInstructions').value;

    if (!personName || !address || !phone) {
        fieldsUnfillMessageEl.textContent = 'Please fill the required fields.';
        return;
    }

    const orderData = {
        orderID: orderID,
        orderObject: orderObject,
        name: personName,
        address: address,
        phone: phone,
        specialInstructions: specialInstructions,
        totalBill: bill
    };

    fetch('/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('orderArray', null);
        mainHeadingEl.innerText = "Thank You For Ordering";
        orderSubmissionSectionEl.innerHTML = `<h1 id="orderSubmissionHeading">Your estimated delivery time is ${data.time}.<br><br>Your Order ID is ${orderID}. Please remember it for future reference.</h1>`;
    })
});