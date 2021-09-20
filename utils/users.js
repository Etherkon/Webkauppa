const data = {
  // make copies of users (prevents changing from outside this module/file)
  users: require('../users.json').map(user => ({ ...user })),
  roles: ['customer', 'admin']
};

/**
 * Reset users back to their initial values (helper function for tests)
 *
 * NOTE: DO NOT EDIT OR USE THIS FUNCTION THIS IS ONLY MEANT TO BE USED BY TESTS
 * Later when database is used this will not be necessary anymore as tests can reset
 * database to a known state directly.
 */
const resetUsers = () => {
  // make copies of users (prevents changing from outside this module/file)
  data.users = require('../users.json').map(user => ({ ...user }));
};

/**
 * Use this object to store products
 *
 * An object is used so that products can be reset to known values in tests
 * a plain const could not be redefined after initialization but object
 * properties do not have that restriction.
 */
const productData = {
  // make copies of products (prevents changing from outside this module/file)
  products: require('../products.json').map(products => ({ ...products })),
  roles: ['customer', 'admin']
};

/**
 * Reset products back to their initial values (helper function for tests)
 *
 * NOTE: DO NOT EDIT OR USE THIS FUNCTION THIS IS ONLY MEANT TO BE USED BY TESTS
 * Later when database is used this will not be necessary anymore as tests can reset
 * database to a known state directly.
 */
const resetProducts = () => {
  // make copies of users (prevents changing from outside this module/file)
  productData.products = require('../products.json').map(products => ({ ...products }));
};

/**
 * Generate a random string for use as user ID
 * @returns {string}
 */
const generateId = () => {
  const id = generateIdAssist();
  
  //do {
    // Generate unique random id that is not already in use
    // Shamelessly borrowed from a Gist. See:
    // https://gist.github.com/gordonbrander/2230317

  //  id = Math.random().toString(36).substr(2, 9);
  //} while (data.users.some(u => u._id === id));

  return id;
};

function generateIdAssist() {
  const id = Math.random().toString(36).substr(2, 9);
  if (!data.users.some(u => u._id === id)) {
    return id;
  }
  generateIdAssist();
}

/**
 * Check if email is already in use by another user
 *
 * @param {string} email
 * @returns {boolean}
 */
const emailInUse = email => {

  const usersToFind = data.users.filter(function(userToFind) {
    return userToFind.email === email;
  });
  
  if(usersToFind.length < 1) { return false; }
  
  return true;
};

/**
 * Return user object with the matching email and password or undefined if not found
 *
 * Returns a copy of the found user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Object|undefined}
 */
const getUser = (email, password) => {
  
  const usersToFind = data.users.filter(function(userToFind) {
    return userToFind.email === email && userToFind.password === password;
  });
  
  const newuser = Object.assign({}, usersToFind);

  return newuser;
};

/**
 * Return user object with the matching ID or undefined if not found.
 *
 * Returns a copy of the user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} userId
 * @returns {Object|undefined}
 */
const getUserById = userId => {

  const usersToFind = data.users.filter(function(userToFind) {
    return userToFind._id === userId;
  });
  
  const newuser = Object.assign({}, usersToFind);

  return newuser;
};

/**
 * Delete user by its ID and return the deleted user
 *
 * @param {string} userId
 * @returns {Object|undefined} deleted user or undefined if user does not exist
 */
const deleteUserById = userId => {

  let deleted = null;
  let deletedUser = null;
  
  const usersToFind = data.users.findIndex(function(userToFind) {
    return userToFind._id === userId;
  });
  deletedUser = data.users[usersToFind];
  deleted = data.users.splice(usersToFind, 1);

  return deletedUser;
};

/**
 * Return all users
 *
 * Returns copies of the users and not the originals
 * to prevent modifying them outside of this module.
 *
 * @returns {Array<Object>} all users
 */
const getAllUsers = () => {

  const newdata = data.users;

  const allusers = newdata.map(element => Object.assign({}, element));

  return allusers;
};

/**
 * Return all products
 *
 * Returns copies of the products and not the originals
 * to prevent modifying them outside of this module.
 *
 * @returns {Array<Object>} all products
 */
const getAllProducts = () => {

  const newdata = productData.products;
  
  const allproducts = newdata.map(element => Object.assign({}, element));

  return allproducts;
};

/**
 * Save new user
 *
 * Saves user only in memory until node process exits (no data persistence)
 * Save a copy and return a (different) copy of the created user
 * to prevent modifying the user outside this module.
 *
 * DO NOT MODIFY OR OVERWRITE users.json
 *
 * @param {Object} user
 * @returns {Object} copy of the created user
 */
const saveNewUser = user => {
  // Use generateId() to assign a unique id to the newly created user.

  user._id = generateId();
  if (!user.role) { user.role = "customer"; }
  if (!user.password) { user.role = "password"; }
  if (!user.email) { user.role = "email"; }
  if (!user.name) { user.role = "name"; }
  data.users.push(Object.assign({}, user));

  return Object.assign({}, data.users[data.users.length - 1]);
};

/**
 * Update user's role
 *
 * Updates user's role or throws an error if role is unknown (not "customer" or "admin")
 *
 * Returns a copy of the user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} userId
 * @param {string} role "customer" or "admin"
 * @returns {Object|undefined} copy of the updated user or undefined if user does not exist
 * @throws {Error} error object with message "Unknown role"
 */
const updateUserRole = (userId, role) => {

  if (role !== "customer" && role !== "admin") {
    throw new Error('Unknown role');
  }

  let newuser;
  let userExists = false;

  const usersToFind = data.users.findIndex(function(userToFind) {
    return userToFind._id === userId;
  });
  
  if(usersToFind) {
      userExists = true;
      newuser = data.users[usersToFind];
      data.users[usersToFind].role = role;
      return Object.assign({}, newuser);
  }

  return newuser;
};

/**
 * Validate user object (Very simple and minimal validation)
 *
 * This function can be used to validate that user has all required
 * fields before saving it.
 *
 * @param {Object} user user object to be validated
 * @returns {Array<string>} Array of error messages or empty array if user is valid
 */
const validateUser = user => {

  const errors = [];
  if (!user.email) { errors.push("Missing email"); }
  if (!user.password) { errors.push("Missing password"); }
  if (!user.name) { errors.push("Missing name"); }
  if (user.role !== "customer" && user.role !== "admin" && user.role) { errors.push("Unknown role"); }

  return errors;
};

module.exports = {
  deleteUserById,
  emailInUse,
  getAllUsers,
  getAllProducts,
  getUser,
  getUserById,
  resetUsers,
  saveNewUser,
  updateUserRole,
  validateUser
};
