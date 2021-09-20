const Order = require("../models/order");
const OrderItem = require("../models/orderitem");
const responseUtils = require("../utils/responseUtils");

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response Response
 */

const getAllOrders = async (response, customerID, role) => {
  response.setHeader("Content-Type", "application/json");

  if(role === 'customer') {
      const ords = await Order.find({ customerId: customerID });
      return responseUtils.sendJson(response, ords, 200);
  }
  else {
      const ords = await Order.find({});
      return responseUtils.sendJson(response, ords, 200);
  }
};

const getOrder = async (response, customerID, orderID, role) => {
  response.setHeader("Content-Type", "application/json");

  const ords = await Order.findOne({ _id: orderID });
  
  if(!ords) {
     return responseUtils.notFound(response);
  }
  
  const customerIDTest = JSON.stringify(customerID);
  if(role === 'customer' && ords.customerId !== customerIDTest.substring(1, customerIDTest.length-1)) {
      return responseUtils.notFound(response);
  }
  
  return responseUtils.sendJson(response, ords, 200);
 
};

const createOrder = async (response, orderData, customerID) => {
	
    const required = ["quantity", "product", "_id", "name", "price"];
    const ERR_MSG = "Order creation failed!";
    let newOrderItem = null;

   if (orderData.items.length < 1 ) {
      responseUtils.badRequest(response, ERR_MSG);
      return;
   }
   
   if (orderData.items.filter(element => !element.quantity).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
   if (orderData.items.filter(element => !element.product).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
   if (orderData.items.filter(element => !element.product._id).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
   if (orderData.items.filter(element => !element.product.name).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
   if (orderData.items.filter(element => !element.product.price).length > 0) { responseUtils.badRequest(response, ERR_MSG); return; }
   
   const newOrderItemArray = orderData.items.map(element => 
        newOrderItem = new OrderItem( {
           product: {
               _id: element.product._id,
                name: element.product.name,
                price: element.product.price,
                description: "Added data"
           },
           quantity: element.quantity
		}));

 // console.log(newOrderItemArray);
 
  const newOrder = new Order({
    customerId: customerID+1,
    products: newOrderItemArray
  });
  
 // console.log(newOrder);
 
  try {
    await newOrder.save();
    responseUtils.sendJson(response, newOrder, 201);
    return;
  } catch (err) {
    console.log(err.toString());
    responseUtils.badRequest(response, err.toString());
  }

};


module.exports = { getAllOrders, createOrder, getOrder };
