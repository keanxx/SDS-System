import React, { useState, useEffect } from 'react';
import {  TextField,  Autocomplete,  Button,  Box,  FormControl,  InputLabel,  MenuItem,  Select,  IconButton, Dialog,  DialogTitle,  DialogContent,  DialogActions,  Typography,  useMediaQuery,  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import Swal from 'sweetalert2';

const TravelInput = () => {
  const [travelers, setTravelers] = useState([
    { uid: '', name: '', position: '', station: '', initial: '' },
  ]);
  const [inclusiveDate, setInclusiveDate] = useState(null);
  const [exclusiveDate, setExclusiveDate] = useState(null);
  const [area, setArea] = useState('');
  const [employees, setEmployees] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [file, setFile] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); 
  const [sourceOfFund, setSourceOfFund] = useState("Local Fund");
  const baseURL = import.meta.env.VITE_API_URL;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

// ...existing code...
const handleSubmit = async () => {
  // Validation
  const missingFields = [];
  if (!travelers.length || !travelers[0].name) missingFields.push('Traveler Name');
  if (!travelers[0].position) missingFields.push('Position/Designation');
  if (!travelers[0].station) missingFields.push('Official/Station');
  if (!document.getElementById('purpose').value.trim()) missingFields.push('Purpose of Travel');
  if (!document.getElementById('host').value.trim()) missingFields.push('Host of Activity');
  if (!inclusiveDate) missingFields.push('Inclusive Date');
  if (!exclusiveDate) missingFields.push('Exclusive Date');
  if (!document.getElementById('destination').value.trim()) missingFields.push('Destination');
  if (!area) missingFields.push('Area');
  if (!document.getElementById('sof').value.trim()) missingFields.push('Source of Fund');
 

  if (missingFields.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      html: `Please fill in the following fields:<br><b>${missingFields.join(', ')}</b>`,
      confirmButtonText: 'OK',
    });
    return;
  }

  try {
    for (const traveler of travelers) {
      const travelDetails = {
        employee_ID: traveler.uid,
        PositionDesignation: traveler.position,
        Station: traveler.station,
        Purpose: document.getElementById('purpose').value.trim(),
        Host: document.getElementById('host').value.trim(),
        DatesFrom: dayjs(inclusiveDate).format('YYYY-MM-DD'),
        DatesTo: dayjs(exclusiveDate).format('YYYY-MM-DD'),
        Destination: document.getElementById('destination').value.trim(),
        Area: area,
        sof: document.getElementById('sof').value.trim(),
      };

      const formData = new FormData();
      Object.entries(travelDetails).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (file) formData.append('attachment', file);

      const response = await axios.post(`${baseURL}/api/travels`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({
        icon: 'success',
        title: 'Submitted!',
        text: 'Travel details submitted successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    }

    setSuccessDialogOpen(true);

    setTravelers([{ name: '', position: '', station: '', initial: '' }]);
    setInclusiveDate(null);
    setExclusiveDate(null);
    setArea('');
    document.getElementById('purpose').value = '';
    document.getElementById('host').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('sof').value = '';
    setFile(null);
  } catch (err) {
    console.error('Failed to submit travel details:', err);
    alert(`Submission failed: ${err.response?.data?.message || err.message}`);
  }
};
// ...existing code...

  const handleRemoveTraveler = (index) => {
    const newTravelers = [...travelers];
    newTravelers.splice(index, 1); // Remove the traveler at the specified index
    setTravelers(newTravelers);
  };

  return (
    <div
      className="bg-white/50 backdrop-blur-md border-gray-500/30 border rounded-lg p-5 space-y-5 w-full max-w-[1100px]"
      style={{
        padding: isMobile ? '16px' : '40px',
      }}
    >
      <h1 className="text-lg font-bold" style={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
        Travel Authority Details
      </h1>
      <div
        className="flex flex-col space-y-5"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Autocomplete Component */}
        <Autocomplete
          disablePortal
          options={employees.length > 0 ? employees : []}
          value={autocompleteValue}
          getOptionLabel={(option) => option.Initial || 'No Initial'}
          onChange={(e, selectedEmployee) => {
            if (selectedEmployee) {
              const newTravelers = [...travelers];
              newTravelers[newTravelers.length - 1] = {
                uid: selectedEmployee.uid,
                name: selectedEmployee.fullname,
                position: selectedEmployee.positionTitle,
                station: selectedEmployee.office,
                initial: selectedEmployee.Initial,
              };
              setTravelers(newTravelers);
              setAutocompleteValue(null);
            }
          }}
          sx={{ width: isMobile ? '100%' : 223 }}
          renderInput={(params) => (
            <TextField {...params} label="Initial/Code" variant="outlined" />
          )}
        />

        {/* Traveler(s) Section */}
        {travelers.map((traveler, index) => (
          <div
            key={index}
            className="flex space-x-5 items-center"
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '10px',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              value={traveler.name}
              onChange={(e) => {
                const newTravelers = [...travelers];
                newTravelers[index].name = e.target.value.toUpperCase();
                setTravelers(newTravelers);
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Position/Designation"
              value={traveler.position}
              onChange={(e) => {
                const newTravelers = [...travelers];
                newTravelers[index].position = e.target.value.toUpperCase();
                setTravelers(newTravelers);
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Official/Station"
              value={traveler.station}
              onChange={(e) => {
                const newTravelers = [...travelers];
                newTravelers[index].station = e.target.value.toUpperCase();
                setTravelers(newTravelers);
              }}
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveTraveler(index)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}

        {/* Add Traveler Button */}
        <Button
          variant="outlined"
          onClick={() => {
            setTravelers([...travelers, { name: '', position: '', station: '', initial: '' }]);
            setAutocompleteValue(null);
          }}
          sx={{ width: isMobile ? '100%' : 'fit-content' }}
        >
          + Add Traveler
        </Button>

        {/* Purpose of Travel */}
        <div
          className="flex space-x-5 w-full"
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <TextField
            id="purpose"
            label="Purpose of Travel"
            variant="outlined"
            fullWidth
            multiline
            sx={{ textTransform: 'uppercase' }}
          />
        </div>

        {/* Host & Dates */}
        <div
          className="flex space-x-5 w-full items-center justify-evenly"
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '20px' : '10px',
          }}
        >
          <TextField
            id="host"
            fullWidth
            variant="outlined"
            label="Host of Activity"
            sx={{ marginTop: isMobile ? 1 : 0, maxWidth: 280 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={['DatePicker', 'DatePicker']}
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '20px' : '10px',
                width: '100%',
              }}
            >
              <DatePicker
                label="Inclusive Date"
                value={inclusiveDate}
                onChange={(newValue) => setInclusiveDate(newValue)}
                slotProps={{
                  textField: {
                    sx: { width: isMobile ? '100%' : 223 },
                  },
                }}
              />
              <DatePicker
                label="Exclusive Date"
                value={exclusiveDate}
                onChange={(newValue) => setExclusiveDate(newValue)}
                slotProps={{
                  textField: {
                    sx: { width: isMobile ? '100%' : 223 },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        {/* Destination */}
        <div
          className="flex space-x-5"
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <TextField
            id="destination"
            fullWidth
            multiline
            variant="outlined"
            label="Destination"
          />
        </div>

        {/* Source of Fund, Area Dropdown, Done Button */}
        <div
          className="flex space-x-5"
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '20px' : '10px',
          }}
        >
          <TextField
  id="sof"
  required
  fullWidth
  multiline
  variant="outlined"
  label="Source of Fund"
  value={sourceOfFund}
  onChange={(e) => setSourceOfFund(e.target.value)}
  sx={{ width: isMobile ? '100%' : 350 }}
/>
          <Box sx={{ minWidth: 120, width: isMobile ? '100%' : 'auto' }}>
            <FormControl fullWidth>
              <InputLabel id="area-select-label">Area</InputLabel>
              <Select
                labelId="area-select-label"
                id="area-select"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                label="Area"
              >
                <MenuItem value="Division">Division</MenuItem>
                <MenuItem value="Region">Region</MenuItem>
                <MenuItem value="National">National</MenuItem>
                <MenuItem value="Abroad">Abroad</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              sx={{ width: isMobile ? '100%' : 223 }}
            >
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

            {file && (
  <Typography
    variant="body2"
    sx={{
      mt: 1,
      fontStyle: 'italic',
      color: 'gray',
      whiteSpace: 'nowrap', // Prevent text from wrapping
      overflow: 'hidden', // Hide overflowed text
      textOverflow: 'ellipsis', // Add ellipsis for overflowed text
      maxWidth: '200px', // Set a maximum width for the text
    }}
  >
    Selected file: {file.name}
  </Typography>
)}
          </Grid>
         

         <Button
  variant="contained"
  sx={{
    width: isMobile ? '100%' : 223,
    height: 48, 
  }}
  onClick={handleSubmit}
>
  Done
</Button>
        </div>
      </div>

     
    </div>
  );
};

export default TravelInput;