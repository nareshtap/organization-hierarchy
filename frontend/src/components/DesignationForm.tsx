import { useState, useEffect, FC } from 'react';
import { Button, Modal, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './style.css';
import { CreateDesignation, DesignationList } from '../helpers/api.ts';
import { toast } from 'react-toastify';

interface Designation {
  _id: string;
  name: string;
}

interface DesignationFormProps {
  fetchDesignations: () => Promise<void>;
}

const DesignationForm: FC<DesignationFormProps> = ({ fetchDesignations }) => {
  const [name, setName] = useState<string>('');
  const [parentDesignation, setParentDesignation] = useState<string>('');
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDesignationsData = async () => {
      const res = await DesignationList();
      setDesignations(res.designations || []);
    };
    fetchDesignationsData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name,
      parentDesignation: parentDesignation !== 'None' ? parentDesignation : null,
    };

    try {
      const res = await CreateDesignation(payload);
      if (res.success) {
        toast.success('Designation added successfully');
      } else {
        toast.error(res.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error){
        toast.error(error.message);
      }
     
    }

    setName('');
    setParentDesignation('');
    setOpen(false);
    fetchDesignations();
  };

  return (
    <>
      <Box className="btnAction">
        <Button className="btnAdd" variant="contained" onClick={() => setOpen(true)}>
          Add Designation
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
              label="Designation Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Parent Designation</InputLabel>
              <Select
                value={parentDesignation}
                onChange={(e) => setParentDesignation(e.target.value)}
              >
                <MenuItem value="None">Top-Level Designation</MenuItem>
                {designations.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Add Designation
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default DesignationForm;