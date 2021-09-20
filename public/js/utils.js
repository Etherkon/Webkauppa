/**
 * Asynchronously fetch JSON from the given url. (GET)
 *
 * Uses fetch to get JSON from the backend and returns the parsed
 * JSON back.
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await getJSON("/api/users");
 *
 *   -- OR --
 *
 *   getJSON("/api/users").then(json => { 
 *     // Do something with the json
 *   })
 *
 * @param {string} url resource url on the server
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const getJSON = async url => {

  return fetch(url).then(
    (res) => {
      return res.json();
    },
    (err) => {
      throw new Error("Error " + err);
    }
  );

};

/**
 * Asynchronously update existing content or create new content on the server (PUT or POST)
 *
 * Uses fetch to send data as JSON to the server and returns the response as JSON.
 * Again remember that async function always returns a Promise.
 *
 * @param {string} url resource url on the server
 * @param {string} method "PUT" or "POST"
 * @param {Object|Array} data payload data be sent to the server as JSON
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const postOrPutJSON = async (url, method, data = {}) => {

  method = method.toUpperCase();
  if (method !== 'POST' && method !== 'PUT') {
    throw 'Invalid method! Valid methods are POST and PUT!';
  }

  // TODO: 8.3 Implement this
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: new Headers({ "content-type": "application/json" })
  }).then((res) => {
    return res;
  });

};

/**
 * Asynchronously remove a resource from the server (DELETE)
 *
 * Uses fetch to send the request to the server and returns the response as JSON.
 * Again remember that async function always returns a Promise.
 *
 * @param {string} url resource url on the server
 * * @param {json} data includes the body data
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const deleteResourse = async url => {
  // TODO: 8.5 Implement this

  return fetch(url, {
    method: "DELETE",
    headers: new Headers({ "content-type": "application/json" })
  }).then((res) => {
    return res;
  });

};

/**
 * Generate random unique id to use as id value on notifications
 * or other HTML elements (remember that IDs must be unique within
 * a document).
 *
 * @returns {string}
 */
const generateId = () => {
  // Shamelessly borrowed from a Gist. See:
  // https://gist.github.com/gordonbrander/2230317
  return ('_' + Math.random().toString(36).substr(2, 9));
};

/**
 * Create a notification message that disappears after five seconds.
 *
 * Appends a new paragraph inside the container element and gives it
 * class based on the status of the message (success or failure).
 *
 * @param {string} message
 * @param {string} containerId id attribute of the container element
 * @param {boolean} isSuccess whether the message describes a success or a failure
 */
const createNotification = (message, containerId, isSuccess = true) => {
  const container = document.getElementById(containerId);

  // Create new p element to hold text
  const newParagraph = document.createElement('p');

  // Create unique id for the notification so that it can easily be removed after timeout
  const notificationId = generateId();
  newParagraph.id = notificationId;

  // Set CSS class for the paragraph based on the isSuccess variable
  newParagraph.classList.add(isSuccess ? 'background-lightgreen' : 'background-red');

  // Add message test inside the paragraph and append the paragraph to the container
  newParagraph.append(document.createTextNode(message));
  container.append(newParagraph);

  // After five seconds remove the notification
  setTimeout(() => {
    removeElement(containerId, notificationId);
  }, 5000);
};

/**
 * Remove an element (and its descendants) from the DOM.
 *
 * @param {string} containerId containing element's id
 * @param {string} elementId id of the element to be removed
 */
const removeElement = (containerId, elementId) => {
  const container = document.getElementById(containerId);
  container.querySelectorAll(`#${elementId}`).forEach(element => element.remove());
};

// SessionStorage tools

/**
 * Adds product to SessionStorage cart
 * 
 * @param {string} product id
 * @return {int} current amount
 */
function addProductToCart(id) {

  let currentAmount = localStorage.getItem(id);

  if (currentAmount === null) {
    localStorage.setItem(id, 1);
    return 1;
  }
  else {
    localStorage.setItem(id, parseInt(currentAmount) + 1);
    return parseInt(currentAmount) + 1;
  }

}

/**
 *  Removes one product from the SessionStorage cart
 * 
 * @param {string} product id
 * @param {int} current amount
 */
function decreaseProductCount(id) {

  let currentAmount = localStorage.getItem(id);

  if (currentAmount === null) {
    return 0;
  }
  else {
    if (parseInt(currentAmount) - 1 <= 0) {
      localStorage.removeItem(id);
      return 0
    } else {
      localStorage.setItem(id, parseInt(currentAmount) - 1);
      return parseInt(currentAmount) - 1;
    }
  }

}

/**
 *  Gets how many products there are in the cart by id
 * 
 * @param {string} product id
 * @returns {object} product
 */
function getProductCountFromCart(id) {

  if (localStorage.getItem(id) === null) {
    return {};
  } else {
    return { id: parseInt(localStorage.getItem(id)) };
  }

}

/**
 *  Gets all products from SessionStorage cart
 * 
 *  @returns {Array} all products
 */
 
let index = 0;
let all_products = [];
 
function getAllProductsFromCart() {

  let storage = Object.entries(localStorage);

  let temp = {};
  temp["id"] = storage[index][0];
  temp["amount"] = parseInt(storage[index][1]);
  all_products.push(temp);
  index += 1;
  if(index < storage.length) {
		getAllProductsFromCart();
  }
  
  index = 0;
  return all_products;
}


/**
 *  Clears SessionStorage cart
 * 
 */
function clearCart() {
  localStorage.clear();
}