const express = require('express');
const router = express.Router();
const Expense = require('../models/expenseModel');

// Route to get expense
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.status(200).json({ data: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
};

router.get('/get-expenses', getExpenses);

// Route to add expense
const addExpense = async (req, res) => {
  try {
    const { month, date, expenseType, expenseAmount } = req.body;
    const newExpense = new Expense({
      month,
      date,
      expenseType,
      expenseAmount
    });
    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', data: newExpense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


router.post('/add-expenses', addExpense);

module.exports = router;
