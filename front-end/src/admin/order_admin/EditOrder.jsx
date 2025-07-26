import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, FormControl,
  Select, MenuItem, InputLabel, AppBar, Toolbar,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const EditOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [schools, setSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const API = `${baseURL}/api`;

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
      setFilteredOrders(res.data); // Initialize filtered orders
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Fetch all schools with their districts
  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${API}/schools-w-district`);
      setSchools(res.data);
    } catch (err) {
      console.error('Error fetching schools and districts:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchSchools();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOrders(
      orders.filter((order) =>
        order.name.toLowerCase().includes(term)
      )
    );
  };

  const handleEditClick = (row) => {
    setEditing({ ...row });
    setOpen(true);
  };

  const handleDelete = async (idorder) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${API}/orders/${idorder}`);
        fetchOrders();
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Failed to delete the order. Please try again.');
      }
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    // Map front-end fields to back-end fields
    const fieldMap = {
      name: 'name',
      address: 'address',
      position: 'position',
      school: 'school', // Send school ID to the backend
      date_signed: 'date_signed',
    };

    // Append fields to formData
    for (let key in fieldMap) {
      const frontendValue = editing[key];

      // Format date fields to YYYY-MM-DD
      if (key === 'date_signed') {
        formData.append(fieldMap[key], frontendValue ? frontendValue.slice(0, 10) : '');
      } else {
        formData.append(fieldMap[key], frontendValue || '');
      }
    }

    // Attach PDF if replaced
    if (editing.pdf) {
      formData.append('pdf', editing.pdf); // Attach if replaced
    }

    try {
      // Send update request to the backend
      const response = await axios.put(`${API}/orders/${editing.idorder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Update successful:', response.data); // Log success response
      setOpen(false); // Close modal/dialog
      fetchOrders(); // Refresh orders list
    } catch (err) {
      console.error('Update failed:', err); // Log error
      alert('Update failed. Please check the data and try again.'); // Show alert
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditing((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
      {/* Header with Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Orders
          </Typography>
          <Button color="inherit" onClick={() => navigate('/admin')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/editOrder')}>Orders</Button>
          <Button color="inherit" onClick={() => navigate('/createOrder')}>Add Orders</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Order Management
        </Typography>

        {/* Search Box */}
        <TextField
          fullWidth
          margin="normal"
          label="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: '70%', maxWidth: 1200 }}
        />

        {/* Table Container centered */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TableContainer component={Paper} sx={{ maxHeight: 500, width: '100%', maxWidth: 1800 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>School</TableCell>
                  <TableCell>District</TableCell>
                  <TableCell>Date Signed</TableCell>
                  <TableCell>PDF</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredOrders.map((row) => (
                  <TableRow key={row.idorder}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.position}</TableCell>
                    <TableCell>{row.school_name}</TableCell>
                    <TableCell>{row.district_name}</TableCell>
                    <TableCell>{row.date_signed}</TableCell>
                    <TableCell sx={{color: row.pdf_path ? 'blue' : 'red'}}>
                      {row.pdf_path ? (
                        <a
                          href={`http://localhost:5000/${row.pdf_path}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        'No PDF Available'
                      )}
                    </TableCell>
                    <TableCell sx={{ display: 'flex' }}>
                      <IconButton onClick={() => handleEditClick(row)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(row.idorder)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Edit Order</DialogTitle>
          <DialogContent>
            {['name', 'address', 'position'].map((field) => (
              <TextField
                key={field}
                margin="dense"
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                type="text"
                fullWidth
                value={editing?.[field] || ''}
                onChange={handleChange}
              />
            ))}

            {/* School Dropdown */}
            <FormControl fullWidth margin="dense">
              <InputLabel>School</InputLabel>
              <Select
                name="school"
                value={editing?.school || ''}
                onChange={handleChange}
              >
                {schools.map((school) => (
                  <MenuItem key={school.school_id} value={school.school_id}>
                    {school.school_name} ({school.district_name})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="date_signed"
              label="Date Signed"
              type="date"
              fullWidth
              value={editing?.date_signed ? editing.date_signed.slice(0, 10) : ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* PDF Upload */}
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) =>
                  setEditing((prev) => ({ ...prev, pdf: e.target.files[0] }))
                }
              />
            </Button>
            {editing?.pdf && (
              <Typography variant="body2" mt={1}>
                Selected file: {editing.pdf.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default EditOrder;