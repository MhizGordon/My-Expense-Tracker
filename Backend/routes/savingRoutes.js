const express = require('express');
const router = express.Router();
const Saving = require('../models/savingModel');

// Route to get savings 
const getSavings = async (req, res) => {
  try {
    const savings = await Saving.find();
    res.json(savings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


router.get('/get-savings', (req, res) => {
  console.log('GET /get-savings request received');
  getSavings(req, res);
});

// Route to add savings
router.post('/add-savings', async (req, res) => {
  try {
    const { month, amount } = req.body;
    const newSaving = new Saving({ month, amount });
    await newSaving.save();
    res.status(201).json({ message: 'Saving added successfully', data: newSaving });
  } catch (error) {
    console.error('Error adding saving:', error);
    res.status(500).json({ message: 'Error adding saving', error });
  }
});

module.exports = router;
