const Employee = require('../models/employee');

exports.addEmployee = async (req, res) => {
  try {
    const { name, designationId } = req.body;

    if (!designationId) {
      return res.status(400).json({ message: 'Please Provide Designation', success: false });
    }

    const existingEmployee = await Employee.findOne({ name });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this name already exists. Please use another name.', success: false });
    }

    const employee = new Employee({ name, designationId });
    await employee.save();

    res.status(201).json({ message: 'Employee added successfully', employee, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error adding employee', error, success: false });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('designationId');
    res.status(200).json({employees, success: true});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error, success: false });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designationId } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, designationId },
      { new: true }
    );
    res.status(200).json({ message: 'Employee updated successfully', updatedEmployee, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error, success: false });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: 'Employee deleted successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error, success: false });
  }
};