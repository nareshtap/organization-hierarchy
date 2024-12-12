import { useState, useEffect } from 'react';
import { 
  Tab, Tabs, Box, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, TextField, Dialog, DialogActions, DialogContent, DialogTitle 
} from '@mui/material';
import DesignationForm from './DesignationForm';
import EmployeeForm from './EmployeeForm';
import HierarchyTree, { Node } from './HierarchyTree';
import { DeleteDesignation, DeleteEmployee, DesignationList, EditDesignation, EditEmployee, GetEmployees, Hierarchy } from '../helpers/api.ts';
import { toast } from 'react-toastify';
import NotFound from './NotFound.tsx';

interface Designation {
  _id: string;
  name: string;
  parentDesignation: Designation | null;
}

interface Employee {
  _id: string;
  name: string;
  designationId: Designation | null;
}

interface DeletingItem {
  type: 'designation' | 'employee';
  id: string;
}

const ManagementTabs: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [designationName, setDesignationName] = useState<string>('');
  const [parentDesignation, setParentDesignation] = useState<string>('');
  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeDesignation, setEmployeeDesignation] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [deletingItem, setDeletingItem] = useState<DeletingItem | null>(null);
  const [data, setData] = useState<Node[]>([]);

  useEffect(() => {
    fetchDesignations();
    fetchEmployees();
  }, []);

  const fetchDesignations = async () => {
    const response = await DesignationList();
    setDesignations(response.designations);
  };

  const fetchEmployees = async () => { 
    const response = await GetEmployees();
    setEmployees(response.employees);
  };

   const fetchHierarchy = async () => {
      const res = await Hierarchy();
      setData(res.hierarchy);
    };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEditDesignation = (designation: Designation) => {
    setEditingDesignation(designation);
    setDesignationName(designation.name);
    setParentDesignation(designation.parentDesignation ? designation.parentDesignation._id : '');
  };

  const handleUpdateDesignation = async () => {
    if (editingDesignation) {
      const payload = {
        name: designationName,
        parentDesignation: parentDesignation,
      };
      const res = await EditDesignation(editingDesignation._id, payload);
      if (res.success) {
        toast.success('Designation Updated successfully');
      } else {
        toast.error(res.message);
      }
      setEditingDesignation(null);
      setDesignationName('');
      setParentDesignation('');
      fetchDesignations();
    }
  };

  const handleDeleteDesignation = (id: string) => {
    setDeletingItem({ type: 'designation', id });
    setOpenDialog(true);
  };

  const handleDeleteEmployee = (id: string) => {
    setDeletingItem({ type: 'employee', id });
    setOpenDialog(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);  
    setEmployeeName(employee.name);
    setEmployeeDesignation(employee.designationId ? employee.designationId._id : '');
  };

  const handleUpdateEmployee = async () => {
    if (editingEmployee) {
      const payload = {
        name: employeeName,
        designationId: employeeDesignation,
      };
      const res = await EditEmployee(editingEmployee._id, payload);
      if (res.success) {
        toast.success('Updated Successfully');
      } else {
        toast.error(res.message);
      }
      setEditingEmployee(null);  
      setEmployeeName('');
      setEmployeeDesignation('');
      await fetchEmployees();
    }
  };

  const confirmDelete = async () => {
    if (deletingItem?.type === 'designation') {
      const res = await DeleteDesignation(deletingItem.id);
      if (res.success) {
        toast.success('Successfully Deleted');
      } else {
        toast.error(res.message);
      }
      fetchDesignations();
      fetchEmployees();
    } else if (deletingItem?.type === 'employee') {
      const res = await DeleteEmployee(deletingItem.id);
      if (res.success) {
        toast.success('Deleted Successfully');
      } else {
        toast.error(res.message);
      }
      fetchEmployees();
    }
    setOpenDialog(false);
    setDeletingItem(null);
  };

  return (
    <Box className="tabMainWrapper">
      <Tabs value={value} onChange={handleTabChange} aria-label="Management Tabs">
        <Tab label='Hierarchy' />
        <Tab label="Designations" />
        <Tab label="Employees" />
      </Tabs>
      {value === 0 && (
        <HierarchyTree fetchHierarchy={fetchHierarchy} data={data as Node[]}/>
      )}
      {value === 1 && (
        <Box>
          <DesignationForm fetchDesignations={fetchDesignations}/>
          <Dialog className='edit-modal-wrapper' open={!!editingDesignation} onClose={() => setEditingDesignation(null)}>
            <DialogTitle>Edit Designation</DialogTitle>
            <DialogContent>
              <Box className="body-wrapper">
                <TextField
                  label="Designation Name"
                  value={designationName}
                  onChange={(e) => setDesignationName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Parent Designation"
                  value={parentDesignation}
                  onChange={(e) => setParentDesignation(e.target.value)}
                  select
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">None</option>
                  {designations.map((designation) => (
                    <option key={designation._id} value={designation._id}>
                      {designation.name}
                    </option>
                  ))}
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingDesignation(null)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleUpdateDesignation} color="secondary">
                Update Designation
              </Button>
            </DialogActions>
          </Dialog>

          <TableContainer component={Paper}>
            <Table className='mainTable'>
              <TableHead>
                <TableRow>
                  <TableCell>Designation</TableCell>
                  <TableCell>Parent Designation</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {designations.length ? designations.map((designation) => (
                  <TableRow key={designation._id}>
                    <TableCell>{designation.name}</TableCell>
                    <TableCell>{designation.parentDesignation ? designation.parentDesignation.name : 'None'}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditDesignation(designation)}>Edit</Button>
                      <Button onClick={() => handleDeleteDesignation(designation._id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                )) : <TableRow key={"not-found"}><TableCell colSpan={3}><NotFound /></TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {value === 2 && (
        <Box>
          <EmployeeForm fetchEmployees={fetchEmployees}/>
          <Dialog className='edit-employee-modal-wrapper' open={!!editingEmployee} onClose={() => setEditingEmployee(null)}>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogContent>
              <TextField
                label="Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Employee Designation"
                value={employeeDesignation}
                onChange={(e) => setEmployeeDesignation(e.target.value)}
                select
                fullWidth
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select Designation</option>
                {designations.map((designation) => (
                  <option key={designation._id} value={designation._id}>
                    {designation.name}
                  </option>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditingEmployee(null)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleUpdateEmployee} color="secondary">
                Update Employee
              </Button>
            </DialogActions>
          </Dialog>

          <TableContainer component={Paper}>
            <Table className='mainTable'>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length ? employees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.designationId?.name}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditEmployee(employee)}>Edit</Button>
                      <Button onClick={() => handleDeleteEmployee(employee._id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                )) : <TableRow key={"not-found"}><TableCell colSpan={3}><NotFound /></TableCell></TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <p>This action will delete the item along with its related data. Are you sure you want to continue?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagementTabs;
