const express = require('express');
const router = express.Router();
const { addIncome, getIncomes } = require('../controllers/incomeControllers');
const { addExpense, getExpenses } = require('../controllers/expenseControllers');
const {getHistory} = require('../controllers/historyControllers');


router.post('/add-income', addIncome)
      .get('/get-incomes', getIncomes) 
      .post('/add-expense', addExpense)
      .get('/get-expenses', getExpenses)
      .get('/history', getHistory);


module.exports = router;