const express = require('express');
const router = express.Router();
const Income = require('../models/incomeModel');


// Route to get income
const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({});
    res.status(200).json({ data: incomes });
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ message: 'Error fetching incomes', error });
  }
}

router.get('/get-incomes', getIncomes);

// Route to add incomes
const addIncomes = async (req, res) => {
  try {
    const { month, date, source, amount } = req.body;
    const newIncome = new Income({
      month,
      date,
      source,
      amount
    });
    await newIncome.save();
    res.status(201).json({ message: 'Income added successfully', data: newExpense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.post('/add-incomes', addIncome);    

module.exports = router;