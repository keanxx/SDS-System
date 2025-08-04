import React, { useEffect, useState, useRef } from 'react';
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
import Swal from 'sweetalert2';

const showSwal = (options) => {
  Swal.fire({
    ...options,
    didOpen: () => {
      const swalContainer = document.querySelector('.swal2-container');
      if (swalContainer) {
        swalContainer.style.zIndex = '2000'; // Ensure Swal is above MUI Dialog
      }
    },
  });
};

const EditAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState({ open: false, message: '', success: false });
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const fileInputRef = useRef(null);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/appointments`);
      setAppointments(res.data);
      setFilteredAppointments(res.data); // Initialize filtered appointments
    } catch (error) {
      showSwal({
        icon: 'error',
        title: 'Error',
        text: `Failed to fetch appointments: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseURL}/api/appointment/${id}`);
        showSwal({
          icon: 'success',
          title: 'Deleted!',
          text: 'The appointment has been deleted.',
        });
        fetchAppointments();
      } catch (error) {
        showSwal({
          icon: 'error',
          title: 'Error',
          text: `Failed to delete appointment: ${error.message}`,
        });
      }
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    // Add fields to the formData
    formData.append('name', editing.Name);
    formData.append('positionTitle', editing.PositionTitle);
    formData.append('schoolOffice', editing.SchoolOffice);
    formData.append('district', editing.District);
    formData.append('statusOfAppointment', editing.StatusOfAppointment);
    formData.append('natureAppointment', editing.NatureAppointment);
    formData.append('itemNo', editing.ItemNo);
    formData.append('dateSigned', editing.DateSigned);
    formData.append(
      'released',
      editing.releasedAt
        ? new Date(editing.releasedAt).toISOString().slice(0, 19).replace('T', ' ') // Convert local to UTC for backend
        : ''
    );
    formData.append('remarks', editing.remarks || ''); // Include remarks

    if (editing.pdf) {
      formData.append('pdf', editing.pdf);
    }

    try {
      const response = await axios.put(`${baseURL}/api/appointment/${editing.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showSwal({
        icon: 'success',
        title: 'Success',
        text: 'Appointment updated successfully!',
      });
      setOpen(false);
      fetchAppointments();
    } catch (err) {
      showSwal({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update appointment. Please check the data and try again.',
      });
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredAppointments(
      appointments.filter((appointment) =>
        appointment.Name.toLowerCase().includes(term)
      )
    );
  };

  const formatToLocalDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr); // Parse date string
    const tzOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localDate = new Date(date.getTime() - tzOffset); // Adjust to local time
    return localDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
  };

  const handleEditClick = (row) => {
    setEditing({
      ...row,
      DateSigned: row.DateSigned
        ? new Date(row.DateSigned).toISOString().slice(0, 10) // Format as YYYY-MM-DD
        : '',
      releasedAt: formatToLocalDateTime(row.releasedAt), // Convert to local time for datetime-local input
      remarks: row.remarks || '', // Ensure remarks is included with a default value
    });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmationClose = () => {
    setConfirmationDialog({ open: false, message: '', success: false });
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
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

        <TextField
          fullWidth
          margin="normal"
          label="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: '70%', maxWidth: 1200 }}
        />

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TableContainer component={Paper} sx={{ maxHeight: 650, width: '100%', maxWidth: 1800 }}>
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
                {filteredAppointments
                  .sort((a, b) => new Date(b.DateSigned) - new Date(a.DateSigned))
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>{row.PositionTitle}</TableCell>
                      <TableCell>{row.SchoolOffice}</TableCell>
                      <TableCell>{row.District}</TableCell>
                      <TableCell>{row.StatusOfAppointment}</TableCell>
                      <TableCell>{row.NatureAppointment}</TableCell>
                      <TableCell>{row.ItemNo}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {row.DateSigned && !isNaN(new Date(row.DateSigned))
                          ? (() => {
                              const date = new Date(row.DateSigned);
                              const month = date.toLocaleString('en-US', { month: 'short' });
                              const day = String(date.getDate()).padStart(2, '0');
                              const year = date.getFullYear();
                              return `${month}-${day}-${year}`;
                            })()
                          : ''}
                      </TableCell>
                      <TableCell>
                        {row.pdfPath ? (
                          <a
                            href={`${baseURL}/${row.pdfPath}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>
                        ) : (
                          'No PDF Available'
                        )}
                      </TableCell>
                      <TableCell sx={{ display: 'flex', alignContent: 'start' }}>
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
              value={editing?.DateSigned || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              margin="dense"
              name="releasedAt"
              label="Release Date"
              type="datetime-local"
              fullWidth
              value={editing?.releasedAt || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              margin="dense"
              name="remarks"
              label="Remarks"
              type="text"
              fullWidth
              value={editing?.remarks || ''}
              onChange={handleChange}
            />

            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                 ref={fileInputRef}
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

        <Dialog
          open={confirmationDialog.open}
          onClose={handleConfirmationClose}
        >
          <DialogTitle>
            {confirmationDialog.success ? 'Success' : 'Error'}
          </DialogTitle>
          <DialogContent>
            <Typography>{confirmationDialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmationClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default EditAppointment;