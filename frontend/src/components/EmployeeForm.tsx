import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import './style.css';
import { CreateEmployee, DesignationList } from '../helpers/api.ts';
import { toast } from 'react-toastify';

interface Designation {
  _id: string;
  name: string;
}

interface EmployeeFormProps {
  fetchEmployees: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ fetchEmployees }) => {
  const [name, setName] = useState<string>('');
  const [designationId, setDesignationId] = useState<string>('');
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const res = await DesignationList();
        if (res && res.designations) {
          setDesignations(res.designations);
        }
      } catch (error: unknown) {
        if( error instanceof Error) console.log("Error", error.message)
      }
    };
    fetchDesignations();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name,
      designationId,
    };

    try {
      const res = await CreateEmployee(payload);
      if (res.success) {
        toast.success('Employee added successfully');
      } else {
        toast.error(res.message || 'Failed to add employee');
      }
    } catch (error: unknown) {
      if( error instanceof Error) toast.error('Something went wrong');
    }

    setName('');
    setDesignationId('');
    setOpen(false);
    fetchEmployees();
  };

  return (
    <>
      <Box className="btnAction">
        <Button
          className="btnAdd"
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add Employee
        </Button>
      </Box>
      <Modal className='modal-wrapper add-desig-modal'  open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              label="Employee Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Designation</InputLabel>
              <Select
                value={designationId}
                onChange={(e) => setDesignationId(e.target.value)}
                required
              >
                <MenuItem value="" disabled>
                  Select Designation
                </MenuItem>
                {designations.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Add Employee
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EmployeeForm;

