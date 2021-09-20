let productIndex = 0;

getJSON('/api/products').then(products => {

    let all_products = products;

    let products_cart = getAllProductsFromCart();

    productUnit(all_products, products_cart, 0);
    productIndex = 0;
});

function productUnit(all_products, products_cart, pIndex) {
	let container = document.querySelector('#cart-container');
	
	let product = products_cart[pIndex];
	
	let current_prod = getProductById(product.id, all_products);

    let template = document.querySelector('#cart-item-template').content.cloneNode(true);
    template.querySelector(".item-row").setAttribute("id", "section-" + product.id);

    // Template elements
    let nameElement = template.querySelector(".product-name");
    let priceElement = template.querySelector(".product-price");
    let amountElement = template.querySelector(".product-amount");

    let plusButton = template.querySelectorAll(".cart-minus-plus-button")[0];
    let minusButton = template.querySelectorAll(".cart-minus-plus-button")[1];

    // Changing values in template
    nameElement.innerHTML = current_prod.name;
    nameElement.setAttribute("id", "name-" + product.id);

    priceElement.innerHTML = current_prod.price;
    priceElement.setAttribute("id", "price-" + product.id);

    amountElement.innerHTML = product.amount + "x";
    amountElement.setAttribute("id", "amount-" + product.id);

    plusButton.setAttribute("id", "plus-" + product.id);
    minusButton.setAttribute("id", "minus-" + product.id);

    container.append(template);

    // Eventlisteners for buttons
    document.querySelector("#plus-" + product.id).addEventListener('click', event => {
        event.preventDefault();
        let new_value = addProductToCart(product.id);
            document.querySelector('#amount-' + product.id).innerHTML = new_value + "x";

        });

        document.querySelector("#minus-" + product.id).addEventListener('click', event => {
            event.preventDefault();
            let new_value = decreaseProductCount(product.id);
            if (new_value <= 0) {
                document.querySelector("#section-" + product.id).remove();
            } else {
                document.querySelector('#amount-' + product.id).innerHTML = new_value + "x";
            }

        });
		
		productIndex += 1;
	    if(productIndex < products_cart.length) { productUnit(all_products, products_cart, productIndex); }
}

document.querySelector("#place-order-button").addEventListener('click', event => {
    event.preventDefault;

    clearCart();
    document.querySelector('#cart-container').innerHTML = "";
    createNotification("Successfully created an order!", "notifications-container");
});

// Gets spesific item by id
function getProductById(id, products) {
	
	const whereProduct = (element) => element._id = id;
    let productToFind = products.findIndex(whereProduct);
    if(productToFind >= 0) { return products[productToFind]; }
    return {};
}
