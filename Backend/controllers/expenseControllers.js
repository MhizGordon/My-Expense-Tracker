const Expense = require("../models/expenseModel");

const getExpenses = async (req, res) => {
  try {
    const { months } = req.query;

    let query = {};
    if (months) {
      // Parse the 'months' query parameter
      const monthsCount = parseInt(months, 10);
      if (!isNaN(monthsCount)) {
        const currentDate = new Date();
        const startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - monthsCount + 1,
          1
        );
        query = { date: { $gte: startDate, $lte: currentDate } }; // Filter by date range
      }
    }

    const expenses = await Expense.find(query).sort({ date: 1 }); // Sort by ascending date
    res.status(200).json({ data: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
};


module.exports = { getExpenses, addExpense };
