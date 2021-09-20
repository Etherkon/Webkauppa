let productIndex = 0;

// Getting all the products from the backend
getJSON('/api/products').then(products => {
    let all_products = products; // Array that list all the products

    listProducts(products, 0);
    productIndex = 0;
});

// Lists all products to the website
function listProducts(products, pIndex) {
	
    // Products container in the document
    let container = document.getElementById("products-container");

	    let product = products[pIndex];
        let template = document.querySelector('#product-template').content.cloneNode(true);

        let id = product._id;
        let name = product.name;
        let description = product.description;
        let price = product.price;

        let nameElement = template.querySelector(".product-name"); // h3
        let descriptionElement = template.querySelector(".product-description");
        let priceElement = template.querySelector(".product-price");
        let addToCartBtn = template.querySelector("button");

        // Changing values in template
        nameElement.innerHTML = name;
        nameElement.setAttribute("id", "name-" + id);

        descriptionElement.innerHTML = description;
        descriptionElement.setAttribute("id", "description-" + id);

        priceElement.innerHTML = price;
        priceElement.setAttribute("id", "price-" + id);
        addToCartBtn.setAttribute("id", "add-to-cart-" + id)

        container.append(template);

        // Eventlistener for adding the product to the cart
        let button = document.querySelector('#add-to-cart-' + id);
        button.addEventListener('click', (event) => {
            event.preventDefault();

            // Add item to cart

            addProductToCart(id);

            createNotification("Added " + product.name + " to cart!", "notifications-container");
        });
      productIndex += 1;
	  if(productIndex < products.length) { listProducts(products, productIndex); }

};