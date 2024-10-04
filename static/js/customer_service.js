function orderIdEnter(event) {
    if (event.key === "Enter") {
        submitOrderId();
    }
}

function queryEnter(event) {
    if (event.key === "Enter") {
        submitQuery();
    }
}

function submitOrderId() {
    const orderId = document.getElementById('orderId').value;
    fetch('/submit_order_id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('querySection').style.display = 'block';
            document.getElementById('orderSection').style.display = 'none';
        }  else {
            document.querySelector('.response-container-id').innerHTML =`<div class="chat-response">${data.message}</div>`;
            document.getElementById('orderId').value = '';
        }
    });
}

function submitQuery() {
    const query = document.getElementById('query').value;
    fetch('/submit_query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('query').value = ''
        document.querySelector('.response-container-query').innerHTML =`<div class="chat-response">${data.response}</div>`;
    });
}