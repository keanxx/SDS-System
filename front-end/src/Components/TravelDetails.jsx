import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  DataGrid,
  GridToolbar
} from '@mui/x-data-grid';
import { styled } from '@mui/system';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import dayjs from 'dayjs';

// Styled DataGrid with always visible column menu (⋮) and text wrapping
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-cell': {
    whiteSpace: 'normal !important',
    wordWrap: 'break-word',
    lineHeight: '1.4',
    paddingTop: '8px',
    paddingBottom: '8px',
    alignItems: 'start',
  },
  '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-iconButtonContainer': {
    visibility: 'visible',
  },
  '& .MuiDataGrid-iconButtonContainer': {
    visibility: 'visible',
    width: 'auto',
  },
}));

const TravelDetails = ({ searchQuery }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [panelContent, setPanelContent] = useState([]);
  const [uniqueStations, setUniqueStations] = useState([]);

  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStationSelection = (station) => {
    setSortDirection(station);
    handleSortMenuClose();
  };

  const getSortedData = () => {
    const data = [...panelContent];
    if (!sortDirection) return data;

    return data.filter((item) => item.Station === sortDirection);
  };

  const getFilteredData = () => {
    const sortedData = getSortedData();

    if (searchQuery) {
      return sortedData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    return sortedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.83.141:3000/travels');
        const data = await response.json();
        setPanelContent(data);

        // Extract unique stations for dropdown
        const stations = [...new Set(data.map((item) => item.Station))];
        setUniqueStations(stations);
      } catch (error) {
        console.error('Failed to fetch travel data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'fullname', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'PositionDesignation', headerName: 'Position/Designation', flex: 1, minWidth: 200 },
    { field: 'Station', headerName: 'Station', flex: 1, minWidth: 150 },
    {
      field: 'Purpose',
      headerName: 'Purpose of Travel',
      flex: 2,
      minWidth: 300,
      renderCell: (params) => (
        <a
          href={`http://192.168.83.141:3000/pdfs/${params.row.Purpose}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#007BFF', textDecoration: 'underline' }}
        >
          {params.value}
        </a>
      ),
    },
    { field: 'Host', headerName: 'Host of Activity', flex: 1, minWidth: 200 },
    {
      field: 'DatesFrom',
      headerName: 'Start Date',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => dayjs(params.value).format('MMM DD, YYYY'),
    },
    {
      field: 'DatesTo',
      headerName: 'End Date',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => dayjs(params.value).format('MMM DD, YYYY'),
    },
    { field: 'Destination', headerName: 'Destination', flex: 1, minWidth: 200 },
    { field: 'sof', headerName: 'Fund Source', flex: 1, minWidth: 200 },
    { field: 'Area', headerName: 'Area', flex: 1, minWidth: 150 },
  ];

  return (
    <section className="py-5 px-5 border-2 border-gray-500/30 rounded shadow-lg min-w-xl w-full min-h-[550px] overflow-y-auto max-h-screen bg-white">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Travel Details</h1>
        {/* Manual Sort dropdown */}
        <Box display="flex" alignItems="center" 
        sx={{
    cursor: 'pointer',
    border: '1px solid black',
    borderRadius: '4px', 
    padding: '4px 4px',
    marginBottom: 1   
  }} onClick={handleSortMenuOpen}>
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            Filter by Station
          </Typography>
          <IconButton>
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSortMenuClose}
          sx={{
            border: '1px solid #ccc', // Adds a border to the dropdown
            borderRadius: '8px', // Optional: Adds rounded corners
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: Adds a subtle shadow
          }}
        >
          {uniqueStations.map((station) => (
            <MenuItem key={station} onClick={() => handleStationSelection(station)}>
              {station}
            </MenuItem>
          ))}
          <MenuItem onClick={() => handleStationSelection(null)}>Reset Filter</MenuItem>
        </Menu>
      </header>

      <Box sx={{ height: 500, width: '100%' }}>
        <StyledDataGrid
          rows={getFilteredData()}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          getRowId={(row) => row.id || row.fullname}
          disableSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </section>
  );
};

export default TravelDetails;
