const responseUtils = require('./utils/responseUtils');
const { acceptsJson, isJson, parseBodyJson } = require('./utils/requestUtils');
const { renderPublic } = require('./utils/render');
const { getAllProducts, deleteProduct, viewProduct, updateProduct, addNewProduct } = require("./controllers/products");
const { getCurrentUser } = require("./auth/auth");
const { sendJson } = require('./utils/responseUtils');
// require user model
const User = require("./models/user");
const { deleteUser, viewUser, updateUser, getAllUsers, registerUser } = require('./controllers/users');
const { getUserById, updateUserRole } = require('./utils/users');
const { getAllOrders, getOrder, createOrder } = require('./controllers/orders');

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  '/api/register': ['POST'],
  '/api/users': ['GET'],
  '/api/products': ['GET', 'POST'],
  '/api/orders': ['GET', 'POST']
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response Response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      'Access-Control-Allow-Methods': allowedMethods[filePath].join(','),
      'Access-Control-Allow-Headers': 'Content-Type,Accept',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Expose-Headers': 'Content-Type,Accept',
//	  "Content-Security-Policy": "default-self: 'self'"
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath Filapath
 * @param {string} prefix Prefix
 * @returns {boolean} Boolean
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = '[0-9a-z]{8,24}';
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} Boolean
 */
const matchUserId = url => {
  return matchIdRoute(url, 'users');
};

/**
 * Does the URL match /api/products/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} Boolean
 */
const matchProductId = url => {
  return matchIdRoute(url, 'products');
};

/**
 * Does the URL match /api/orders/{id}
 *
 * @param {string} url filePath
 * @returns {boolean} Boolean
 */

const matchOrderId = url => {
  return matchIdRoute(url, 'orders');
};

const handleRequest = async (request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === 'GET' && !filePath.startsWith('/api')) {
    const fileName = filePath === '/' || filePath === '' ? 'index.html' : filePath;
    return renderPublic(fileName, response);
  }

  // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
  if (matchUserId(filePath)) {

    const currUser = await getCurrentUser(request);

    if (!auth(response, currUser, "Admin")) return;

    if (!acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
    }

    const id = filePath.split("/")[3];

    if (!getUserById(id)) {
      return responseUtils.notFound(response);
    }

    if (method.toUpperCase() === 'DELETE') {
      deleteUser(response, id, currUser);
      return;
    }

    else if (method.toUpperCase() === 'GET') {

      viewUser(response, id, currUser);
      return;

    }
    if (method.toUpperCase() === 'PUT') {
      const userData = await parseBodyJson(request);
      return updateUser(response, id, currUser, userData);

    }
  }

  if (matchProductId(filePath)) {

    const currUser = await getCurrentUser(request);

    const id = filePath.split("/")[3];

    if (method.toUpperCase() === 'GET') {
      if (!auth(response, currUser, "Customer")) return;
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      viewProduct(response, id);
      return;
    }

    if (method.toUpperCase() === 'DELETE') {
      if (!auth(response, currUser, "Admin")) return;
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      deleteProduct(response, id);
      return;
    }

    if (method.toUpperCase() === 'PUT') {
      if (!auth(response, currUser, "Admin")) return;
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }

      const productData = await parseBodyJson(request);
      return updateProduct(response, id, productData);

    }

    if (method.toUpperCase() === 'POST') {
      if (!auth(response, currUser, "Admin")) return;
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }

      addNewProduct(response, id, productData);
      return;

    }

  }

  if (matchOrderId(filePath)) {

    const currUser = await getCurrentUser(request);
	
	if (!auth(response, currUser, false)) return;
    const id = filePath.split("/")[3];
  
    if (method.toUpperCase() === 'GET') {
      if (!acceptsJson(request)) {
        return responseUtils.contentTypeNotAcceptable(response);
      }
      return getOrder(response, currUser._id, id, currUser['role']);
    }

  }

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === 'OPTIONS') return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }

  // GET all users
  if (filePath === '/api/users' && method.toUpperCase() === 'GET') {
    // TODO: 8.3 Return all users as JSON

    const currUser = await getCurrentUser(request);

    if (!auth(response, currUser, "Admin")) return;

    getAllUsers(response);

    // TODO: 8.4 Add authentication (only allowed to users with role "admin")
  }

  // GET all products
  if (filePath === '/api/products' && method.toUpperCase() === 'GET') {

    const currUser = await getCurrentUser(request);

    if (!auth(response, currUser, "Customer")) return;

    return getAllProducts(response);
  }

  // add a new product
  if (filePath === '/api/products' && method.toUpperCase() === 'POST') {

    const currUser = await getCurrentUser(request);

    // Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, "Invalid Content-Type. Expected application/json");
    }

    if (!auth(response, currUser, "Admin")) return;

    const productData = await parseBodyJson(request);

    addNewProduct(response, productData);

  }

// GET all orders
   if (filePath === '/api/orders' && method.toUpperCase() === 'GET') {

    const currUser = await getCurrentUser(request);

    if (!auth(response, currUser, false)) return;
	
	if (currUser['role'] === 'admin') {
      return getAllOrders(response, currUser._id, 'admin');
    }
	
    return getAllOrders(response, currUser._id, 'customer');
  }
  
    
   if (filePath === '/api/orders' && method.toUpperCase() === 'POST') {

    const currUser = await getCurrentUser(request);
    if (!auth(response, currUser, false)) return;

    if (currUser['role'] === 'admin') {
      responseUtils.forbidden(response);
      return false;
    }
	
	// Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, "Invalid Content-Type. Expected application/json");
    }
	
	const orderData = await parseBodyJson(request);
	
    return createOrder(response, orderData, currUser._id);
  }


  // register new user
  if (filePath === '/api/register' && method.toUpperCase() === 'POST') {

    // Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, "Invalid Content-Type. Expected application/json");
    }

    const userData = await parseBodyJson(request);

    registerUser(response, userData);

  }

};

const auth = function (response, currUser, role) {
  if (currUser === null) {
    responseUtils.basicAuthChallenge(response, "FF");
    return false;
  }

  if (role === "Admin") {
    if (currUser['role'] !== 'admin') {
      responseUtils.forbidden(response);
      return false;
    }
  }
  else if (role === "Customer") {
    if (!(currUser['role'] === 'admin' || currUser['role'] === 'customer')) {
      responseUtils.forbidden(response);
      return false;
    }
  }
  else if (role === "Non-logged-in") {
    if (currUser['role'] === "Admin" || currUser["role"] !== "Customer") {
      responseUtils.forbidden(response);
      return false;
    }
  }
  return true;
};

module.exports = { handleRequest };
