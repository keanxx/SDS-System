import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
} from '@mui/material';
import axios from 'axios';
import BulkAppointmentUpload from '../AdminComponents/BulkAppointment';
import { useNavigate } from 'react-router-dom';

const CreateAppointment = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    positionTitle: '',
    schoolOffice: '',
    district: '',
    statusOfAppointment: '',
    natureAppointment: '',
    itemNo: '',
    dateSigned: '',
    remarks: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
  const upperCaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: upperCaseValue, // Update state with uppercase value
  }));
};
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form Data:', formData); // Log the form data

  try {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (pdfFile) {
      data.append('pdf', pdfFile);
    }

    const response = await axios.post('http://localhost:5000/api/appointment', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Appointment submitted successfully!');
    setFormData({
      name: '',
      positionTitle: '',
      schoolOffice: '',
      district: '',
      statusOfAppointment: '',
      natureAppointment: '',
      itemNo: '',
      dateSigned: '',
      remarks: '',
    });
    setPdfFile(null);
  } catch (error) {
    console.error('Error submitting data:', error); // Log the error
    alert('Failed to submit data.');
  }
};

  return (
    <Box>
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

      <Box sx={{ maxWidth: 900, margin: 'auto', padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Name Field */}
            <Grid item xs={12}>
              <TextField
                sx={{ minWidth: 250 }}
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            {/* Position Title and Status of Appointment */}
            <Grid item xs={6}>
              <TextField
                sx={{ minWidth: 250 }}
                fullWidth
                label="Position Title"
                name="positionTitle"
                value={formData.positionTitle}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ minWidth: 250 }}>
                <InputLabel>STATUS OF APPOINTMENT</InputLabel>
                <Select
                  name="statusOfAppointment"
                  value={formData.statusOfAppointment}
                  onChange={handleChange}
                >
                  <MenuItem value="PERMANENT">PERMANENT</MenuItem>
                  <MenuItem value="TEMPORARY">TEMPORARY</MenuItem>
                  <MenuItem value="PROVISIONAL">PROVISIONAL</MenuItem>
                  <MenuItem value="SUBSTITUTE">SUBSTITUTE</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* School/Office and District */}
            <Grid item xs={6}>
              <TextField
                sx={{ minWidth: 250 }}
                fullWidth
                label="School/Office"
                name="schoolOffice"
                value={formData.schoolOffice}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ minWidth: 250 }}
                fullWidth
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
              />
            </Grid>

            {/* Nature of Appointment */}
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ minWidth: 250 }}>
                <InputLabel>NATURE OF APPOINTMENT</InputLabel>
                <Select
                  name="natureAppointment"
                  value={formData.natureAppointment}
                  onChange={handleChange}
                >
                  <MenuItem value="DEMOTION">DEMOTION</MenuItem>
                  <MenuItem value="ORIGINAL">ORIGINAL</MenuItem>
                  <MenuItem value="PROMOTIONAL">PROMOTIONAL</MenuItem>
                  <MenuItem value="REAPPOINTMENT">REAPPOINTMENT</MenuItem>
                  <MenuItem value="RECLASSIFICATION">RECLASSIFICATION</MenuItem>
                  <MenuItem value="RE-EMPLOYMENT">RE-EMPLOYMENT</MenuItem>
                  <MenuItem value="TRANSFER">TRANSFER</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Item No. and Date Signed */}
            <Grid item xs={6}>
              <TextField
                sx={{ minWidth: 250 }}
                fullWidth
                label="Item No."
                name="itemNo"
                value={formData.itemNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ minWidth: 250 }}
                fullWidth
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ minWidth: 250 }}
                fullWidth
                label="Date Signed"
                name="dateSigned"
                type="date"
                value={formData.dateSigned}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            

            {/* PDF Upload */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => setPdfFile(e.target.files[0])}
                />
              </Button>
              {pdfFile && <Typography variant="body2" mt={1}>{pdfFile.name}</Typography>}
            </Grid>
          </Grid>
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </form>

        <Box
          sx={{
            mt: 20,
            borderTop: '1px solid #ccc',
            pt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Bulk Insertion and Update
          </Typography>
          <BulkAppointmentUpload />
        </Box>
      </Box>
    </Box>
  );
};

export default CreateAppointment;