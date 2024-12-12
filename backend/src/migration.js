const mongoose = require('mongoose');
const Designation = require('./models/designation');
const Employee = require('./models/employee');
require('dotenv').config({ path: './src/config.env' });

async function runMigration() {
  try {

    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    const existingDesignations = await Designation.find();
    if (existingDesignations.length === 0) {
      console.log('No Designations found. Inserting sample designations...');

      const ceo = new Designation({ name: 'CEO' });
      const cto = new Designation({ name: 'CTO', parentDesignation: ceo._id });
      const manager = new Designation({ name: 'Manager', parentDesignation: cto._id });
      const softwareEngineer = new Designation({ name: 'Engineer', parentDesignation: manager._id });
      const hr = new Designation({ name: 'HR', parentDesignation: ceo._id });

      await ceo.save();
      await cto.save();
      await manager.save();
      await softwareEngineer.save();
      await hr.save();

      console.log('Designations inserted successfully!');
    } else {
      console.log('Designations already exist.');
    }


    const existingEmployees = await Employee.find();
    if (existingEmployees.length === 0) {
      console.log('No Employees found. Inserting sample employees...');

 
      const ceo = await Designation.findOne({ name: 'CEO' });
      const cto = await Designation.findOne({ name: 'CTO' });
      const manager = await Designation.findOne({ name: 'Manager' });
      const softwareEngineer = await Designation.findOne({ name: 'Engineer' });
      const hr = await Designation.findOne({ name: 'HR' });

      const employees = [
        { name: 'John Doe', designationId: ceo._id },
        { name: 'Jane Smith', designationId: cto._id },
        { name: 'Alice Brown', designationId: manager._id },
        { name: 'Bob Johnson', designationId: softwareEngineer._id },
        { name: 'Charlie Davis', designationId: hr._id },
        { name: 'David Wilson', designationId: softwareEngineer._id },
        { name: 'Emily Clark', designationId: manager._id }
      ];

    
      await Employee.insertMany(employees);
      console.log('Employees inserted successfully!');
    } else {
      console.log('Employees already exist.');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error running migration:', error);
    mongoose.connection.close();
  }
}


runMigration();
