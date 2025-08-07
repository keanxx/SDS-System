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
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';

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

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

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
  <Paper sx={{ p: { xs: 1, sm: 2 }, mt: 2 }}>
    <Typography variant="h6" mb={2}>
      Travel Details
    </Typography>

    {/* Filters */}
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
      {/* Search */}
      <Box flex={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          label="Search"
          size="small"
        />
      </Box>

      {/* Filters */}
      <Box flex={1}>
        <FormControl fullWidth variant="outlined" size="small">
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

      <Box flex={1}>
        <FormControl fullWidth variant="outlined" size="small">
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

      <Box flex={1}>
        <FormControl fullWidth variant="outlined" size="small">
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
    </Stack>

    {/* Responsive Table or Accordion */}
    {!isSmall ? (
      <>
        <TableContainer component={Paper} sx={{ maxHeight: 650, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{fontWeight: 'bold', minWidth: 125, whiteSpace: 'nowrap'}}>Name</TableCell>
                <TableCell sx={{fontWeight: 'bold', minWidth: 200}}>Position</TableCell>
                <TableCell sx={{fontWeight: 'bold', minWidth: 200}}>Station</TableCell>
                <TableCell sx={{fontWeight: 'bold', minWidth: 250}}>Purpose</TableCell>
                <TableCell sx={{fontWeight: 'bold', minWidth: 200}}>Host</TableCell>
                <TableCell sx={{fontWeight: 'bold', minWidth: 180}}>Travel Period</TableCell>
                <TableCell sx={{fontWeight: 'bold', minWidth: 200}}>Destination</TableCell>
                <TableCell sx={{fontWeight: 'bold', minWidth: 140}}>Source of Fund</TableCell>
                <TableCell sx={{fontWeight: 'bold'}}>Area</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: 'white',
                      zIndex: 1,
                    }}
                  >
                    {row.Attachment ? (
                      <a
                        href={`${baseURL}${row.Attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
                      >
                        {row.Fullname}
                      </a>
                    ) : row.Fullname}
                  </TableCell>
                  <TableCell>{row.PositionDesignation}</TableCell>
                  <TableCell>{row.Station}</TableCell>
                  <TableCell>{row.Purpose}</TableCell>
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

        {/* Total Data Count */}
        <Box sx={{ mt: 2, textAlign: { xs: 'center', md: 'end' } }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Total Entries: {filteredData.length}
          </Typography>
        </Box>
      </>
    ) : (
      <Alert severity="info">Use a larger screen to view full travel details.</Alert>
    )}
  </Paper>
);
};

export default TravelDetails;