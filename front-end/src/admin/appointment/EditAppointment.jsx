import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, FormControl,
  Select, MenuItem, InputLabel, AppBar, Toolbar,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';



const EditAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL ;

  const API = `${baseURL}/api`;
  const fetchAppointments = async () => {
    const res = await axios.get(`${API}/appointments`);
    setAppointments(res.data);
    setFilteredAppointments(res.data); // Initialize filtered appointments
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredAppointments(
      appointments.filter((appointment) =>
        appointment.Name.toLowerCase().includes(term)
      )
    );
  };

  const handleEditClick = (row) => {
    setEditing({ ...row });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await axios.delete(`${API}/appointment/${id}`);
      fetchAppointments();
    }
  };

  const handleUpdate = async () => {
  const formData = new FormData();

  // Map front-end fields to back-end fields
  const fieldMap = {
    Name: 'name',
    PositionTitle: 'positionTitle',
    SchoolOffice: 'schoolOffice',
    District: 'district',
    StatusOfAppointment: 'statusOfAppointment',
    NatureAppointment: 'natureAppointment',
    ItemNo: 'itemNo',
    DateSigned: 'dateSigned',
    Remarks: 'remarks', // Added mapping for remarks
  };

  // Append fields to formData
  for (let key in fieldMap) {
    const frontendValue = editing[key];
    formData.append(fieldMap[key], frontendValue || '');
  }

  // Attach PDF if replaced
  if (editing.pdf) {
    formData.append('pdf', editing.pdf); // attach if replaced
  }

  try {
    // Send update request to the backend
    const response = await axios.put(`${API}/appointment/${editing.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('Update successful:', response.data); // Log success response
    setOpen(false); // Close modal/dialog
    fetchAppointments(); // Refresh appointments list
  } catch (err) {
    console.error('Update failed:', err); // Log error
    alert('Update failed. Please check the data and try again.'); // Show alert
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
      {/* Header with Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Appointments
          </Typography>
          <Button color="inherit" onClick={() => navigate('/admin')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/editAppointment')}>Appointments</Button>
          <Button color="inherit" onClick={() => navigate('/createAppointment')}>Add Appointments</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Appointment Management
        </Typography>

        {/* Search Box */}
        <TextField
          fullWidth
          margin="normal"
          label="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: '70%', maxWidth: 1200}}
        />

        {/* Table Container centered */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <TableContainer component={Paper} sx={{ maxHeight: 500, width: '100%', maxWidth: 1800 }}>

            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Office</TableCell>
                  <TableCell>District</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Nature</TableCell>
                  <TableCell>Item No</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>PDF</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAppointments.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.Name}</TableCell>
                    <TableCell>{row.PositionTitle}</TableCell>
                    <TableCell>{row.SchoolOffice}</TableCell>
                    <TableCell>{row.District}</TableCell>
                    <TableCell>{row.StatusOfAppointment}</TableCell>
                    <TableCell>{row.NatureAppointment}</TableCell>
                    <TableCell>{row.ItemNo}</TableCell>
                    <TableCell>
                      {row.DateSigned &&
                      !isNaN(new Date(row.DateSigned).getTime())
                        ? new Date(row.DateSigned).toLocaleDateString('en-CA')
                        : ''}
                    </TableCell>
                    <TableCell>
                      {row.pdfPath ? (
                        <a
                          href={`http://localhost:5000/${row.pdfPath}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        'No PDF Available'
                      )}
                    </TableCell>
                    <TableCell sx={{ display: 'flex' }}>
                      <IconButton onClick={() => handleEditClick(row)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(row.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogContent>
            {['Name', 'PositionTitle', 'SchoolOffice', 'District'].map((field) => (
              <TextField
                key={field}
                margin="dense"
                name={field}
                label={field}
                type="text"
                fullWidth
                value={editing?.[field] || ''}
                onChange={handleChange}
              />
            ))}

            {/* Dropdowns */}
            <FormControl fullWidth margin="dense">
              <InputLabel>Status of Appointment</InputLabel>
              <Select
                name="StatusOfAppointment"
                value={editing?.StatusOfAppointment || ''}
                onChange={handleChange}
                label="Status of Appointment"
              >
                <MenuItem value="PERMANENT">PERMANENT</MenuItem>
                <MenuItem value="TEMPORARY">TEMPORARY</MenuItem>
                <MenuItem value="PROVISIONAL">PROVISIONAL</MenuItem>
                <MenuItem value="SUBSTITUTE">SUBSTITUTE</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Nature of Appointment</InputLabel>
              <Select
                name="NatureAppointment"
                value={editing?.NatureAppointment || ''}
                onChange={handleChange}
                label="Nature of Appointment"
              >
                <MenuItem value="ORIGINAL">ORIGINAL</MenuItem>
                <MenuItem value="PROMOTIONAL">PROMOTIONAL</MenuItem>
                <MenuItem value="TRANSFER">TRANSFER</MenuItem>
                <MenuItem value="REAPPOINTMENT">REAPPOINTMENT</MenuItem>
                <MenuItem value="RE-EMPLOYMENT">RE-EMPLOYMENT</MenuItem>
                <MenuItem value="DEMOTION">DEMOTION</MenuItem>
                <MenuItem value="RECLASSIFICATION">RECLASSIFICATION</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="ItemNo"
              label="Item No"
              type="text"
              fullWidth
              value={editing?.ItemNo || ''}
              onChange={handleChange}
            />

            <TextField
              margin="dense"
              name="DateSigned"
              label="Date Signed"
              type="date"
              fullWidth
              value={editing?.DateSigned ? editing.DateSigned.slice(0, 10) : ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* PDF Upload */}
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) =>
                  setEditing((prev) => ({ ...prev, pdf: e.target.files[0] }))
                }
              />
            </Button>
            {editing?.pdf && (
              <Typography variant="body2" mt={1}>
                Selected file: {editing.pdf.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default EditAppointment;
