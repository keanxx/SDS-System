import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from '@mui/material';

const AppointmentTable = ({ searchQuery, setSearchQuery }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const [natureOptions, setNatureOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedNature, setSelectedNature] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);

        const uniqueNature = [...new Set(res.data.map(item => item.NatureAppointment))];
        const uniqueStatus = [...new Set(res.data.map(item => item.StatusOfAppointment))];
        const uniqueDistricts = [...new Set(res.data.map(item => item.District))];
        setNatureOptions(uniqueNature);
        setStatusOptions(uniqueStatus);
        setDistrictOptions(uniqueDistricts);
      })
      .catch((err) => {
        console.error('Error fetching appointments:', err);
        setLoading(false);
      });
  }, []);

  const filteredAppointments = appointments
    .filter((row) => {
      const matchesSearch = Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesNature = selectedNature ? row.NatureAppointment === selectedNature : true;
      const matchesStatus = selectedStatus ? row.StatusOfAppointment === selectedStatus : true;
      const matchesDistrict = selectedDistrict ? row.District === selectedDistrict : true;
      return matchesSearch && matchesNature && matchesStatus && matchesDistrict;
    })
    .sort((a, b) => {
      const surnameA = a.Name.split(' ').slice(-1)[0].toLowerCase(); // Extract surname
      const surnameB = b.Name.split(' ').slice(-1)[0].toLowerCase(); // Extract surname
      return surnameA.localeCompare(surnameB); // Compare surnames alphabetically
    });

  return (
    <Box sx={{ margin: 'auto', px: 3, py: 3 }}>
      {/* Search and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          sx={{ minWidth: 350 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          label="Search here"
          size="small"
        />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>

          {/* District Dropdown */}
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>District</InputLabel>
            <Select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              label="District"
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {districtOptions.map((option, idx) => (
                <MenuItem key={idx} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Nature of Appointment</InputLabel>
            <Select
              value={selectedNature}
              onChange={(e) => setSelectedNature(e.target.value)}
              label="Nature of Appointment"
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {natureOptions.map((option, idx) => (
                <MenuItem key={idx} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Status of Appointment</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status of Appointment"
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {statusOptions.map((option, idx) => (
                <MenuItem key={idx} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          
        </Box>
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                  <TableCell sx={{ whiteSpace: 'nowrap', width: 180, textAlign: 'center' }}><strong>Name</strong></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', width: 150, textAlign: 'center' }}><strong>Position Title</strong></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', width: 160, textAlign: 'center' }}><strong>School/Office</strong></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', width: 160, textAlign: 'center' }}><strong>District</strong></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', width: 160, textAlign: 'center' }}><strong>Status of Appointment</strong></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', width: 160, textAlign: 'center' }}><strong>Nature of Appointment</strong></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', width: 130, textAlign: 'center' }}><strong>Item No.</strong></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', width: 130, textAlign: 'center' }}><strong>Date Signed</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" sx={{ py: 2 }}>
                        No appointments found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                          '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                      >
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {row.pdfPath ? (
                            <a
                              href={`http://localhost:5000/${row.pdfPath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
                            >
                              {row.Name}
                            </a>
                          ) : row.Name}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.PositionTitle}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.SchoolOffice}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.District}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.StatusOfAppointment}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.NatureAppointment}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                          {row.ItemNo?.replace(' ', '\n')}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {row.DateSigned && !isNaN(new Date(row.DateSigned))
                            ? new Date(row.DateSigned).toLocaleDateString('en-CA')
                            : ''}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[7, 12, 24]}
            component="div"
            count={filteredAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AppointmentTable;
