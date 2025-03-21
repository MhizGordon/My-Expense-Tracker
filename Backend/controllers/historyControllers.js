const Income = require('../models/incomeModel');
const Expense = require('../models/expenseModel');

const getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find();
        res.json(incomes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addIncome = async (req, res) => {
    try {
        const { month, date, source, amount } = req.body; 
        const newIncome = new Income({
            month,
            date,
            source,
            amount,
        });

        const savedIncome = await newIncome.save(); // Save to database

        res.status(201).json(savedIncome); // Send the saved income as JSON
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle errors
    }
};

const getHistory = async (req, res) => {
    try {
      const incomes = await HistoryService.fetchIncomes();
      const expenses = await HistoryService.fetchExpenses();
      
      const history = {
        incomes,
        expenses
      };
  
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching history', error });
    }
  };
module.exports = { getIncomes, getExpenses, addIncome, getHistory }; // Export the functions