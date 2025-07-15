import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Alert,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import dayjs from 'dayjs';

const TravelDetails = ({ searchQuery }) => {
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]);
  const [stationFilter, setStationFilter] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [travelRes, employeeRes] = await Promise.all([
          fetch('http://localhost:5000/api/travels'),
          fetch('http://localhost:5000/api/employees'),
        ]);

        const [travels, employees] = await Promise.all([
          travelRes.json(),
          employeeRes.json(),
        ]);

        const merged = travels.map((travel) => {
          const match = employees.find(emp => emp.uid === travel.employee_ID);
          return {
            ...travel,
            Fullname: match ? match.fullname : 'Unknown',
          };
        });

        setData(merged);
        setStations([...new Set(merged.map(t => t.Station).filter(Boolean))]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterOpen = (e) => setAnchorEl(e.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);
  const applyStationFilter = (station) => {
    setStationFilter(station);
    handleFilterClose();
  };

  const filteredData = data.filter((item) => {
    const matchesStation = stationFilter ? item.Station === stationFilter : true;
    const matchesSearch = searchQuery
      ? Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;
    return matchesStation && matchesSearch;
  });

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Travel Details</Typography>
        <Box display="flex" alignItems="center" onClick={handleFilterOpen} sx={{ cursor: 'pointer' }}>
          <Typography>Filter by Station</Typography>
          <IconButton>
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
          {stations.map((station) => (
            <MenuItem key={station} onClick={() => applyStationFilter(station)}>
              {station}
            </MenuItem>
          ))}
          <MenuItem onClick={() => applyStationFilter(null)}>Reset Filter</MenuItem>
        </Menu>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 500, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Station</TableCell>
              <TableCell>Purpose / Attachment</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Travel Period</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Source of Fund</TableCell>
              <TableCell>Area</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.Fullname}</TableCell>
                  <TableCell>{row.PositionDesignation}</TableCell>
                  <TableCell>{row.Station}</TableCell>
                  <TableCell>
                    <div>{row.Purpose || 'N/A'}</div>
                    {row.Attachment ? (
                      <a
                        href={`http://localhost:5000${row.Attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007BFF', textDecoration: 'underline', display: 'inline-block', marginTop: '4px' }}
                      >
                        View PDF
                      </a>
                    ) : (
                      <div style={{ fontStyle: 'italic', color: '#888' }}>None</div>
                    )}
                  </TableCell>
                  <TableCell>{row.Host}</TableCell>
                  <TableCell>
                    {row.DatesFrom && row.DatesTo
                      ? `${dayjs(row.DatesFrom).format('MMM DD')} - ${dayjs(row.DatesTo).format('MMM DD, YYYY')}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{row.Destination}</TableCell>
                  <TableCell>{row.sof}</TableCell>
                  <TableCell>{row.Area}</TableCell>
                </TableRow>
              ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TravelDetails;