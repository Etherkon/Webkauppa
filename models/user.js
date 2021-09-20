const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   // TODO: 9.4 Implement this
   name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
   },
   email: {
      type: String,
      validate: {
         validator: function (v) {
            const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(v).toLowerCase());
         },
         message: props => `Not a valid email.`
      },
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
      minlength: 10,
      set: hashPassword,
      validate: {
         validator: function (v) {
            if (v !== "") { return true; }
            return false;
         },
         message: props => `The password is too short.`
      }
   },
   role: {
      type: String,
      trim: true,
      lowercase: true,
      default: "customer",
      validate: {
         validator: function (v) {
            if (v !== "admin" && v !== "customer") { return false; }
            return true;
         },
         message: props => `An unknown role.`
      },
   }
});

function hashPassword(password) {
   if (password === "" || password.length < 10) { return password; }
   return bcrypt.hashSync(password, 10);
}

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password Password
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = function (password) {
   // TODO: 9.4 Implement this

   return bcrypt.compareSync(password, this.password);
};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = new mongoose.model('User', userSchema);
module.exports = User;
