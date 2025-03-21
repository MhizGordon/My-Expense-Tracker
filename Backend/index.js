require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const incomeRoutes = require('./routes/incomeRoutes'); // Import the income routes
const expenseRoutes = require('./routes/expenseRoutes');
const savingRoutes = require('./routes/savingRoutes');
const loginRoutes = require('./routes/loginRoutes');
const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1', incomeRoutes); // Mount income routes under /api
app.use('/api/v1', expenseRoutes); 
app.use('/api/v1', savingRoutes);
app.use('/api/v1/login', loginRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', historyRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});