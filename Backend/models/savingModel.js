const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema({
  month: { type: String, required: true },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('Saving', savingSchema);
