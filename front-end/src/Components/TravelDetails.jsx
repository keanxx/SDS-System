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
  Box,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import dayjs from 'dayjs';

const TravelDetails = ({ searchQuery: initialSearchQuery }) => {
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]);
  const [areas, setAreas] = useState([]);
  const [positions, setPositions] = useState([]);
  const [stationFilter, setStationFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [travelRes, employeeRes] = await Promise.all([
          fetch(`${baseURL}/api/travels`),
          fetch(`${baseURL}/api/employees`),
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
        setAreas([...new Set(merged.map(t => t.Area).filter(Boolean))]);
        setPositions([...new Set(merged.map(t => t.PositionDesignation).filter(Boolean))]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesStation = stationFilter ? item.Station === stationFilter : true;
    const matchesArea = areaFilter ? item.Area === areaFilter : true;
    const matchesPosition = positionFilter ? item.PositionDesignation === positionFilter : true;
    const matchesSearch = searchQuery
      ? Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;
    return matchesStation && matchesArea && matchesPosition && matchesSearch;
  });

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
      <Typography variant="h6" mb={2}>
        Travel Details
      </Typography>

      {/* Filters */}
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} mb={2}>
        {/* Search Field */}
        <Box flex={1}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Search"
          />
        </Box>

        {/* Station Filter */}
        <Box flex={1}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="station-filter-label">Filter by Station</InputLabel>
            <Select
              labelId="station-filter-label"
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              label="Filter by Station"
            >
              <MenuItem value="">All Stations</MenuItem>
              {stations.map((station) => (
                <MenuItem key={station} value={station}>
                  {station}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Area Filter */}
        <Box flex={1}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="area-filter-label">Filter by Area</InputLabel>
            <Select
              labelId="area-filter-label"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              label="Filter by Area"
            >
              <MenuItem value="">All Areas</MenuItem>
              {areas.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Position Filter */}
        <Box flex={1}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="position-filter-label">Filter by Position</InputLabel>
            <Select
              labelId="position-filter-label"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              label="Filter by Position"
            >
              <MenuItem value="">All Positions</MenuItem>
              {positions.map((position) => (
                <MenuItem key={position} value={position}>
                  {position}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table */}
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
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.Fullname}</TableCell>
                <TableCell>{row.PositionDesignation}</TableCell>
                <TableCell>{row.Station}</TableCell>
                <TableCell>
                  <div>{row.Purpose || 'N/A'}</div>
                  {row.Attachment ? (
                    <a
                      href={`${baseURL}${row.Attachment}`}
                     // href={`${baseURL}${t.Attachment}`}
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
    </Paper>
  );
};

export default TravelDetails;