const User = require("../models/user");
const responseUtils = require("../utils/responseUtils");

/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response Response
 */
const getAllUsers = async response => {
  // TODO: 10.1 Implement this
  const allUsers = await User.find({});
  responseUtils.sendJson(response, allUsers, 200);
  return;
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response Response
 * @param {string} userId UserId
 * @param {object} currentUser (mongoose document object) CurrentUser
 */
const deleteUser = async (response, userId, currentUser) => {
  // TODO: 10.1 Implement this
  if (currentUser === null || userId === currentUser._id.toString()) {
    return responseUtils.badRequest(response, "You cannot delete your own data!");
  } else {
    const user = await User.findById(userId).exec(); // Getting the user by id

    if (!user) return responseUtils.notFound(response);
    // Returning the user

    responseUtils.sendJson(response, user, 200);
    return await User.deleteOne({ _id: userId }); // and also deleting
  }
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response Response
 * @param {string} userId UserId
 * @param {object} currentUser (mongoose document object) CurrentUser
 * @param {object} userData JSON data from request body UserData
 */
const updateUser = async (response, userId, currentUser, userData) => {
  // TODO: 10.1 Implement this

  // Cannot update own data
  if (currentUser === null || userId === currentUser._id.toString()) {
    responseUtils.badRequest(response, "Updating own data is not allowed");
    return;
  }

  const user = await User.findById(userId).exec(); // Getting the user by id

  // Not found 404
  if (!user) return responseUtils.notFound(response);

  const roles = ["admin", "customer"];

  if (!roles.includes(userData.role)) { // Checks that role is valid
    console.log("Not valid role");
    return responseUtils.badRequest(response, "Role is not valid!");

  }

  user.role = userData.role;
  // Sending the response
  responseUtils.sendJson(response, user, 200);

  await user.save();
  return;

};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response Response
 * @param {string} userId UserId
 * @param {object} currentUser (mongoose document object) CurrentUser
 */
const viewUser = async (response, userId, currentUser) => {
  // TODO: 10.1 Implement this

  const user = await User.findById(userId).exec(); // Getting the user by id
  if (!user) return responseUtils.notFound(response);

  // Just returning the user
  responseUtils.sendJson(response, user, 200);
  return;
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response Response
 * @param {object} userData JSON data from request body
 */
const registerUser = async (response, userData) => {
  // TODO: 10.1 Implement this

  const required = ["email", "name", "password"];
  const ERR_MSG = "Registeration failed!";

  // Checking that every field is filled correctly
  if (required.filter(element => !userData[element]).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
  if (required.filter(element => userData[element] === "").length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
  if (required.filter(element => userData[element] === undefined).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
  if (required.filter(element => userData[element] === null).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }

  if (await User.findOne({ email: userData.email }).exec()) {
    // If all required fields are present: Check if email in use
    responseUtils.badRequest(response, ERR_MSG);
    return;
  }

  // Check password length
  if (userData.password === undefined || userData.password.length < 10) {
    responseUtils.badRequest(response, ERR_MSG);
    return;
  }

  const newUserData = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: "customer",
  };

  const newUser = new User(newUserData);

  try {
    await newUser.save();
    responseUtils.sendJson(response, newUser, 201);
    return;
  } catch (err) {
    responseUtils.badRequest(response, err.toString());
  }

};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser };
