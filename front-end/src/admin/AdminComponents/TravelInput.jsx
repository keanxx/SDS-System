import React, { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios'; // Import Axios for API calls
import { filterStateInitializer } from '@mui/x-data-grid/internals';

const TravelInput = () => {
  const [travelers, setTravelers] = useState([
    { uid:'',name: '', position: '', station: '', initial: '' },
  ]);
  const [inclusiveDate, setInclusiveDate] = useState(null);
  const [exclusiveDate, setExclusiveDate] = useState(null);
  const [area, setArea] = useState('');
  const [employees, setEmployees] = useState([]); // State for employees
  const [autocompleteValue, setAutocompleteValue] = useState(null); // State to control Autocomplete value

  // Fetch employees data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://192.168.83.141:3000/api/employees');
        setEmployees(response.data); // Update employees state with API data
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

 const handleSubmit = async () => {
  // Validate required fields
  if (!inclusiveDate || !exclusiveDate) {
    alert('Please select both Inclusive Date and Exclusive Date.');
    return;
  }

  if (!area) {
    alert('Please select an Area.');
    return;
  }

  const purpose = document.getElementById('purpose').value.trim();
  const host = document.getElementById('host').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const sof = document.getElementById('sof').value.trim();

  if (!purpose || !host || !destination || !sof) {
    alert('Please fill out all required fields.');
    return;
  }

  for (const traveler of travelers) {
    if (!traveler.name.trim() || !traveler.position.trim() || !traveler.station.trim()) {
      alert('Please fill out all traveler details.');
      return;
    }
  }

  if (dayjs(inclusiveDate).isAfter(dayjs(exclusiveDate))) {
    alert('Inclusive Date cannot be after Exclusive Date.');
    return;
  }

  const commonDetails = {
    purpose,
    host,
    datesfrom: dayjs(inclusiveDate).format('YYYY-MM-DD'),
    datesto: dayjs(exclusiveDate).format('YYYY-MM-DD'),
    destination,
    area,
    sof,
  };

  try {
    // Iterate over all travelers and send their details
    for (const traveler of travelers) {
      const travelDetails = {
        employeeID: parseInt(traveler.uid) || null,
        positiondesignation: traveler.position,
        station: traveler.station,
        ...commonDetails, // Include common details for all travelers
      };

      await axios.post('http://192.168.83.141:3000/api/travels', travelDetails);
    }

    alert('Travel details submitted successfully!');
    console.log('Submitted travelers:', travelers);

    // Optional: reset form
    setTravelers([{ name: '', position: '', station: '', initial: '' }]);
    setInclusiveDate(null);
    setExclusiveDate(null);
    setArea('');
    document.getElementById('purpose').value = '';
    document.getElementById('host').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('sof').value = '';
  } catch (err) {
    console.error('Failed to submit travel details:', err);
    alert(`Submission failed: ${err.response?.data?.message || err.message}`);
  }
};


  return (
    <div className="bg-white/50 backdrop-blur-md border-green-500/30 border rounded-lg p-10 space-y-5 w-full max-w-[1100px]">
      <h1 className="text-lg font-bold">Travel Authority Details</h1>
      <div className="flex flex-col space-y-5">
        {/* Autocomplete Component */}
        <Autocomplete
          disablePortal
          options={employees.length > 0 ? employees : []}
          value={autocompleteValue} // Bind the value to the state
          getOptionLabel={(option) => option.Initial || 'No Initial'}
          onChange={(e, selectedEmployee) => {
            if (selectedEmployee) {
              const newTravelers = [...travelers];
              // Update the last traveler in the list with the selected employee's details
              newTravelers[newTravelers.length - 1] = {
                uid: selectedEmployee.uid, // Include the uid here
                name: selectedEmployee.fullname,
                position: selectedEmployee.positionTitle,
                station: selectedEmployee.office,
                initial: selectedEmployee.Initial,
              };
              setTravelers(newTravelers);
              setAutocompleteValue(null); // Reset the Autocomplete value
            }
          }}
          sx={{ width: 223 }}
          renderInput={(params) => (
            <TextField {...params} label="Initial/Code" variant="outlined" />
          )}
        />

        {/* Traveler(s) Section */}
        {travelers.map((traveler, index) => (
          <div key={index} className="flex space-x-5 justify-between">
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              value={traveler.name}
              onChange={(e) => {
                const newTravelers = [...travelers];
                newTravelers[index].name = e.target.value;
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
                newTravelers[index].position = e.target.value;
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
                newTravelers[index].station = e.target.value;
                setTravelers(newTravelers);
              }}
            />
          </div>
        ))}

        {/* Add Traveler Button */}
        <Button
          variant="outlined"
          onClick={() => {
            // Add a new empty traveler to the list
            setTravelers([...travelers, { name: '', position: '', station: '', initial: '' }]);
            setAutocompleteValue(null); // Reset the Autocomplete value
          }}
          sx={{ width: 'fit-content' }}
        >
          + Add Traveler
        </Button>

        {/* Purpose of Travel */}
        <div className="flex space-x-5 w-full">
          <TextField
            id="purpose"
            label="Purpose of Travel"
            variant="outlined"
            fullWidth
            multiline
          />
        </div>

        {/* Host & Dates */}
        <div className="flex space-x-5 w-full items-center justify-evenly">
          <TextField
            id="host"
            fullWidth
            variant="outlined"
            label="Host of Activity"
            sx={{ marginTop: 1, maxWidth: 280 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={['DatePicker', 'DatePicker']}
              sx={{ display: 'flex', width: '100%' }}
            >
              <DatePicker
                label="Inclusive Date"
                value={inclusiveDate}
                onChange={(newValue) => setInclusiveDate(newValue)}
                slotProps={{
                  textField: {
                    sx: { width: 223 },
                  },
                }}
              />
              <DatePicker
                label="Exclusive Date"
                value={exclusiveDate}
                onChange={(newValue) => setExclusiveDate(newValue)}
                slotProps={{
                  textField: {
                    sx: { width: 223 },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        {/* Destination */}
        <div className="flex space-x-5">
          <TextField
            id="destination"
            fullWidth
            multiline
            variant="outlined"
            label="Destination"
          />
        </div>

        {/* Source of Fund, Area Dropdown, Done Button */}
        <div className="flex space-x-5">
          <TextField
            id="sof"
            required
            fullWidth
            multiline
            variant="outlined"
            label="Source of Fund"
            sx={{ width: 350 }}
          />
          <Box sx={{ minWidth: 120 }}>
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
          <Button
            variant="contained"
            sx={{
              width: 223,
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