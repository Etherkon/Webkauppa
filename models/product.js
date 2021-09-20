const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

   /*_id: {
      type: String
   },*/
   name: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      min: 0,
      comments: "price of one product in Euros, without the Euro sign (€). Euros and cents are in the same float, with cents coming after the decimal point",
      required: true
   },
   image: {
      type: String,
      format: "uri",
      comments: "Adding product images to the Web store API and pages is a Level 2 development grader substitute"
   },
   description: {
      type: String,
      comments: "Classic Danish-style red 2*4 plastic building block"
   }
});


// Omit the version key when serialized to JSON
productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;
