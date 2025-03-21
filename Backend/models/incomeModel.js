const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  month: { type: String, required: true },
  date: { type: String, required: true },   
  source: { type: String, required: true }, 
  amount: { type: Number, required: true }, 
});

module.exports = mongoose.model('Income', incomeSchema);