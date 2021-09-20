const Product = require("../models/product");
const responseUtils = require("../utils/responseUtils");

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response Response
 */
const getAllProducts = async (response) => {
  // TODO: 10.1 Implement this
  response.setHeader("Content-Type", "application/json");

  const prods = await Product.find({});
  return responseUtils.sendJson(response, prods, 200);

};

/**
 * Send one product with spesfic id
 *
 * @param {http.ServerResponse} response Response
 */
const viewProduct = async (response, id) => {
  // TODgetAllProductsO: 10.1 Implement this
  response.setHeader("Content-Type", "application/json");

  const product = await Product.findById(id).exec();
  if (!product) return responseUtils.notFound(response);

  return responseUtils.sendJson(response, product, 200);

};

/**
 * delete Product
 *
 * @param {http.ServerResponse} response Response
 */
const deleteProduct = async (response, id) => {
  // TODgetAllProductsO: 10.1 Implement this
  response.setHeader("Content-Type", "application/json");

  const product = await Product.findById(id).exec();
  if (!product) return responseUtils.notFound(response);

  responseUtils.sendJson(response, product, 200);
  return await Product.deleteOne({ _id: id });
};

/**
 * delete Product
 *
 * @param {http.ServerResponse} response Response
 */
const updateProduct = async (response, id, productData) => {
  // TODgetAllProductsO: 10.1 Implement this
  const product = await Product.findById(id).exec();

  if (!product) return responseUtils.notFound(response);

  // Updating name
  if (productData.name !== undefined) {
    if (productData.name.length === 0) {
      return responseUtils.badRequest(response, "Name is not valid!");
    }
    else {
      product.name = productData.name;
    }
  }

  // Updating price
  if (productData.price !== undefined) {
    if (typeof productData.price !== "number") {
      return responseUtils.badRequest(response, "Price is not valid!");
    }
    if (productData.price <= 0) {
      return responseUtils.badRequest(response, "Price is not valid!");
    }
    product.price = productData.price;
  }

  if (productData.image) {
    product.image = productData.image;
  }
  if (productData.description) {
    product.description = productData.description;
  }

  responseUtils.sendJson(response, product, 200);

  await product.save();
  return;
};

const addNewProduct = async (response, productData) => {

  const required = ["name", "price", "image", "description"];
  const ERR_MSG = "Adding new product failed!";

  // Checking that every field is filled correctly
  if (required.filter(element => !productData[element]).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
  if (required.filter(element => productData[element] === "").length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
  if (required.filter(element => productData[element] === undefined).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
  if (required.filter(element => productData[element] === null).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }

  if (productData.name) {
    if (typeof productData.name !== "string") {
      responseUtils.badRequest(response, ERR_MSG);
      return;
    }
    if (productData.name === "") {
      responseUtils.badRequest(response, ERR_MSG);
      return;
    }
  } else {
    responseUtils.badRequest(response, ERR_MSG);
    return;
  }

  // Check price 
  if (productData.price) {
    if (typeof productData.price !== "number") {
      responseUtils.badRequest(response, ERR_MSG);
      return;
    }
    if (productData.price <= 0) {
      responseUtils.badRequest(response, ERR_MSG);
      return;
    }
  } else {
    responseUtils.badRequest(response, ERR_MSG);
    return;
  }


  const newProductData = {
    name: productData.name,
    price: productData.price,
    image: productData.image,
    description: productData.description,
  };

  const newProduct = new Product(newProductData);

  try {
    await newProduct.save();
    responseUtils.sendJson(response, newProduct, 201);
    return;
  } catch (err) {
    responseUtils.badRequest(response, err.toString());
  }
};



module.exports = { getAllProducts, deleteProduct, viewProduct, updateProduct, addNewProduct };
