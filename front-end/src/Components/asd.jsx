// import React, { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid'; // Import GridToolbar
// import { styled } from '@mui/system';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// // Styled DataGrid to ensure text wrapping
// const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
//   '& .MuiDataGrid-cell': {
//     whiteSpace: 'normal !important', // Ensures text wraps
//     wordWrap: 'break-word', // Breaks long words
//     lineHeight: '1.4', // Adjusts line height for better readability
//     paddingTop: '8px',
//     paddingBottom: '8px',
//     alignItems: 'start', // Aligns text to the top of the cell
//   },
// }));

// const TravelDetails = ({ searchQuery }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [sortDirection, setSortDirection] = useState(null); // Sort direction: 'asc', 'desc', or null
//   const [panelContent, setPanelContent] = useState([]); // Data fetched from the API

//   const handleSortMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleSortMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSortSelection = (direction) => {
//     setSortDirection(direction);
//     handleSortMenuClose();
//   };

//   const getSortedData = () => {
//     const data = [...panelContent];
//     if (!sortDirection) return data;

//     return data.sort((a, b) => {
//       if (a.Name < b.Name) return sortDirection === 'asc' ? -1 : 1;
//       if (a.Name > b.Name) return sortDirection === 'asc' ? 1 : -1;
//       return 0;
//     });
//   };

//   const getFilteredData = () => {
//     const sortedData = getSortedData();

//     // When there is a search query, return all matching results
//     if (searchQuery) {
//       return sortedData.filter((item) =>
//         Object.values(item).some((value) =>
//           value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//     }

//     return sortedData;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://192.168.80.139:3000/travels');
//         const data = await response.json();
//         setPanelContent(data);
//       } catch (error) {
//         console.error('Failed to fetch travel data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Define columns for the DataGrid
//   const columns = [
//     { field: 'Name', headerName: 'Name', flex: 1, minWidth: 150 },
//     { field: 'PositionDesignation', headerName: 'Position/Designation', flex: 1, minWidth: 200 },
//     { field: 'Station', headerName: 'Station', flex: 1, minWidth: 150 },
//     {
//       field: 'Purpose',
//       headerName: 'Purpose of Travel',
//       flex: 2,
//       minWidth: 300,
//     },
//     { field: 'Host', headerName: 'Host of Activity', flex: 1, minWidth: 200 },
//     { field: 'DatesFrom', headerName: 'Start Date', flex: 1, minWidth: 150 },
//     { field: 'DatesTo', headerName: 'End Date', flex: 1, minWidth: 150 },
//     { field: 'Destination', headerName: 'Destination', flex: 1, minWidth: 200 },
//     { field: 'fundSource', headerName: 'Fund Source', flex: 1, minWidth: 200 },
//   ];

//   return (
//     <section className="py-5 px-5 border-2 border-green-500/30 rounded shadow-lg min-w-xl w-full min-h-[550px] overflow-y-auto max-h-screen bg-white">
//       <header className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold mb-4">Travel Details</h1>
//         {/* Sort dropdown menu */}
//         <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={handleSortMenuOpen}>
//           <Typography variant="body1" sx={{ marginRight: 1 }}>
//             Sort By
//           </Typography>
//           <IconButton>
//             <ArrowDropDownIcon />
//           </IconButton>
//         </Box>
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleSortMenuClose}
//         >
//           <MenuItem onClick={() => handleSortSelection('asc')}>Sort A → Z</MenuItem>
//           <MenuItem onClick={() => handleSortSelection('desc')}>Sort Z → A</MenuItem>
//           <MenuItem onClick={() => handleSortSelection(null)}>Reset Sort</MenuItem>
//         </Menu>
//       </header>

//       {/* Styled DataGrid */}
//       <Box sx={{ height: 500, width: '100%' }}>
//         <StyledDataGrid
//           rows={getFilteredData()}
//           columns={columns}
//           pageSize={10}
//           rowsPerPageOptions={[10, 20, 50]}
//           getRowId={(row) => row.id || row.Name} // Use a unique identifier for rows
//           disableSelectionOnClick
//           components={{
//             Toolbar: GridToolbar, // Adds a toolbar to the DataGrid
//           }}

//         />
//       </Box>
//     </section>
//   );
// };

// export default TravelDetails;