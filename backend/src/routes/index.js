const express = require('express');
const designationController = require('../controllers/designationController');
const employeeController = require('../controllers/employeeController');

const router = express.Router();



router.post('/employees', employeeController.addEmployee);
router.get('/employees', employeeController.getEmployees);
router.put('/employees/:id', employeeController.updateEmployee);
router.delete('/employees/:id', employeeController.deleteEmployee);

router.get('/hierarchy', designationController.getHierarchy);


router.post('/designations', designationController.addDesignation);
router.get('/designations/list', designationController.list);
router.put('/designations/:id', designationController.updateDesignation);
router.delete('/designations/:id', designationController.deleteDesignation);
  

module.exports = router;

