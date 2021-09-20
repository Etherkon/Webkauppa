const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrderedItemSchema = new Schema({

   product: {
           _id: {
              type: String,
              comments: "the ID of the ordered product NOT auto-generated",
              required: true,
            },
            name: {
               type: String,
               required: true
            },
            price: {
               type: Number,
               min: 0,
               comments: "price of one product in Euros, without the Euro sign (€). Euros and cents are in the same float, with cents coming after the decimal point",
               required: true
            },
            description: {
                type: String,
                comments: "Classic Danish-style red 2*4 plastic building block"
            }
   },
   quantity: {
       type: Number,
       required: true,
       min: 0
   }
});


OrderedItemSchema.set('toJSON', { virtuals: false, versionKey: false });

const OrderItem = new mongoose.model('OrderItem', OrderedItemSchema);
module.exports = OrderItem;
