const mongoose = require('mongoose');

const DesignationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentDesignation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation', default: null },
});

module.exports = mongoose.model('Designation', DesignationSchema);

