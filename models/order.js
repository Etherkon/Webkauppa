const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderItem = require("../models/orderitem");



const orderSchema = new Schema({

   /*_id: {
      type: String
   },*/
   customerId: {
      type: String,
      required: true
   },
   products: {
      type: Array,
      minLength: 1,
      items: [OrderItem],
      comments: "Array of order items. Each item must have a COPY of the product information (no image) and the amount of products ordered",
      required: true
   }
});

// Omit the version key when serialized to JSON
orderSchema.set('toJSON', { virtuals: false, versionKey: false });

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;
