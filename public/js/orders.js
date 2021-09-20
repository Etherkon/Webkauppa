

// Getting all the products from the backend
getJSON('/api/orders').then(orders => {
    let all_orders = orders; // Array that list all the products

    listOrders(orders, 0);

});

// Lists all products to the website
function listOrders(orders, pIndex) {
	

};