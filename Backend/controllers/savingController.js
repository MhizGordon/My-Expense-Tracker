const Saving = require('../models/Saving');

exports.getSavings = async (req, res) => {
  try {
    const savings = await Saving.find();
    res.json(savings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addSaving = async (req, res) => {
  try {
    const { month, amount } = req.body;
    const newSaving = new Saving({ month, amount });
    await newSaving.save();
    res.status(201).json({ message: 'Saving added successfully', data: newSaving });
  } catch (error) {
    res.status(500).json({ message: 'Error adding saving', error });
  }
};
