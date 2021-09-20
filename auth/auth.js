// require user model
const User = require("../models/user");

/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request
 * @returns {Object|null} current authenticated user or null if not yet authenticated
 */

const { getCredentials } = require("../utils/requestUtils.js");

const getCurrentUser = async request => {
  // TODO: 8.4 Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user

  const credentials = getCredentials(request);
  if (!credentials) { return null; }

  const userEmail = credentials[0];
  const userPassword = credentials[1];

  // find one user with an email
  const currentUser = await User.findOne({ email: userEmail }).exec();

  if (!currentUser) return null;

  if (currentUser.checkPassword(userPassword)) {
    return currentUser;
  } else {
    return null;
  }

};

module.exports = { getCurrentUser };
