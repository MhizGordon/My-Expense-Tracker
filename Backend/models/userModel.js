const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  email: { type: String, required: true, unique: true },
  occupation: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;
