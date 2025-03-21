const Income = require('../models/incomeModel');
const Expense = require('../models/expenseModel');

const dashboardController = {
  getDashboardData: async (req, res) => {
    try {
      // Fetch income data
      const incomes = await Income.find();
      const lastMonthsIncome = incomes.map(income => `${income.month}: $${income.amount}`);
      const currentMonthIncome = incomes[incomes.length - 1]?.amount || 0;

      // Fetch expense data
      const expenses = await Expense.find();
      const lastMonthsExpense = expenses.map(expense => `${expense.month}: $${expense.amount}`);
      const currentMonthExpense = expenses[expenses.length - 1]?.amount || 0;

      // Calculate savings
      const lastMonthsSavings = lastMonthsIncome.map((income, index) => {
        const incomeAmount = parseFloat(income.split(': $')[1]);
        const expenseAmount = parseFloat(lastMonthsExpense[index].split(': $')[1]);
        return `${income.split(': ')[0]}: $${incomeAmount - expenseAmount}`;
      });

      const totalCurrentMonthIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
      const totalCurrentMonthExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      // Send response
      res.json({
        lastMonthsIncome,
        currentMonthIncome,
        lastMonthsExpense,
        currentMonthExpense,
        lastMonthsSavings,
        totalCurrentMonthIncome,
        totalCurrentMonthExpense,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};


module.exports = dashboardController;