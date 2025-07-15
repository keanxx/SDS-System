import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TablePagination,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';

const CustomTable = ({ searchQuery }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL ;
  
  // Fetch travel data from API
  useEffect(() => {
    setLoading(true);
    axios.get(`${baseURL}/api/travels`)
      .then(response => {
        setTravels(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching travels:', err);
        setError('Failed to load travel data. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Filter travels based on search query - Enhanced version
  const filteredTravels = travels.filter(travel => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Search across all fields in the travel object
    return Object.entries(travel).some(([key, value]) => {
      // Skip searching through non-string values or empty values
      if (typeof value !== 'string' && typeof value !== 'number') return false;
      if (value === null || value === undefined) return false;
      
      // Convert value to string and check if it includes the query
      return String(value).toLowerCase().includes(query);
    });
  });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get travel status based on dates
  const getTravelStatus = (travel) => {
    const now = dayjs();
    const startDate = dayjs(travel.DatesFrom);
    const endDate = dayjs(travel.DatesTo);

    if (startDate.isAfter(now)) {
      return { label: 'Upcoming', color: 'error' };
    } else if (endDate.isBefore(now)) {
      return { label: 'Completed', color: 'success' };
    } else {
      return { label: 'Ongoing', color: 'primary' };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '95%', overflow: 'hidden', mt: 2, mb: 4 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="travel data table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Purpose</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Destination</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Travel Period</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTravels
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((travel, index) => {
                const status = getTravelStatus(travel);
                return (
                  <TableRow hover key={index}>
                    <TableCell sx={{ width: '20%', whiteSpace: 'nowrap' }}>
  {travel.fullname || 'N/A'}
</TableCell>
                    <TableCell>
  {travel.attachment ? (
    <a 
      href={`${baseURL}${travel.attachment}`} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{ color: 'blue', textDecoration: 'underline' }}
    >
      {travel.Purpose || 'View PDF'}
    </a>
  ) : (
    travel.Purpose || 'None'
  )}
</TableCell>

                    <TableCell>{travel.Destination || 'N/A'}</TableCell>
                    <TableCell
                      sx={{ width: '20%', whiteSpace: 'nowrap' }}>
                      {travel.DatesFrom && travel.DatesTo ? 
                        `${formatDate(travel.DatesFrom)} - ${formatDate(travel.DatesTo)}` : 
                        'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={status.label} 
                        color={status.color} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            {filteredTravels.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" py={3}>
                    No travel records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredTravels.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CustomTable;