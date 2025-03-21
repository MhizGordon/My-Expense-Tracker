const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  month: { type: String, required: true },
  date: { type: String, required: true },   
  expenseType: { type: String, required: true }, 
  expenseAmount: { type: Number, required: true }, 
});

module.exports = mongoose.model('Expense', expenseSchema);
