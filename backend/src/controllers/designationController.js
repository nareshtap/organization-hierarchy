const Designation = require('../models/designation');
const Employee = require('../models/employee');

exports.addDesignation = async (req, res) => {
  try {
    const { name, parentDesignation } = req.body;

    const existingDesignation = await Designation.findOne({ name });
    if (existingDesignation) {
      return res.status(400).json({ success: false, message: 'Designation with this name already exists.' });
    }

    if (parentDesignation === null) {
      const topLevelDesignation = await Designation.findOne({ parentDesignation: null });
      if (topLevelDesignation) {
        return res.status(400).json({ success: false, message: 'There can only be one top-level designation. Please provide a valid parentDesignation.' });
      }
    }

    const designation = new Designation({ name, parentDesignation });
    await designation.save();

    res.status(201).json({ success: true, message: 'Designation added successfully', designation });
  } catch (error) {
    res.status(500).json({ success: false ,message: 'Error adding designation', error });
  }
};

exports.list = async (req, res) => {
  try {
    const designations = await Designation.find().populate('parentDesignation');
    res.status(200).json({designations, success: true});
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

exports.getHierarchy = async (req, res) => {
  try {
    const buildTree = async (parentDesignation = null) => {
      const designations = await Designation.find({ parentDesignation });
      const result = await Promise.all(
        designations.map(async (designation) => {
          const employees = await Employee.find({ designationId: designation._id }).populate('designationId');
          return {
            designation_name: designation.name,
            employees: employees.map((e) => ({employeeName : e.name, designation : e.designationId})),
            children: await buildTree(designation._id),
          };
        })
      );
      return result;
    };

    const hierarchy = await buildTree();
    res.status(200).json({hierarchy, success: true});
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving hierarchy', error, success: false });
  }
};



exports.updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentDesignation } = req.body;

    const designation = await Designation.findById(id);

    if (!designation) {
      return res.status(404).json({ message: 'Designation not found', success: false });
    }

    if (designation.parentDesignation === null && parentDesignation !== undefined) {
      return res.status(400).json({
        message: 'Cannot update parentDesignation',
        success: false
      });
    }

    if(designation._id.toString() === parentDesignation){
      return res.status(400).json({
        message: 'can not make own parent Designation',
        success: false
      });
    }

    const updateData = { name };

    if (parentDesignation !== undefined && parentDesignation !== null) {
      updateData.parentDesignation = parentDesignation;
    }

   
    const updatedDesignation = await Designation.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: 'Designation updated successfully', updatedDesignation, success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating designation', error, success: false });
  }
};


exports.deleteDesignation = async (req, res) => {
  try { 
    const { id } = req.params;

    const findChildDesignations = async (parentId) => {
      const children = await Designation.find({ parentDesignation: parentId });
      let childIds = children.map(child => child._id);
      for (let childId of childIds) {
        childIds = childIds.concat(await findChildDesignations(childId));
      }
      return childIds;
    };

    
    const childDesignations = await findChildDesignations(id);
    childDesignations.push(id); 

    await Employee.deleteMany({ designationId: { $in: childDesignations } });
   
    await Designation.deleteMany({ _id: { $in: childDesignations } });

    res.status(200).json({ message: 'Designation and related employees deleted successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting designation and related employees', error, success: false });
  }
};