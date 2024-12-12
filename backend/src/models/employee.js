const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation', required: true },
});

module.exports = mongoose.model('Employee', EmployeeSchema);

