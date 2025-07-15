import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Button, IconButton, Dialog, DialogTitle, DialogActions,
  TablePagination, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import Header from '../../Components/Header';

const AdminTravelTable = () => {
  const [travels, setTravels] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editDialog, setEditDialog] = useState({ open: false, data: null });
const [editFile, setEditFile] = useState(null);


  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/travels');
      setTravels(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Failed to fetch travels:', err);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setFiltered(travels.filter(t => t.fullname?.toLowerCase().includes(val)));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/travels/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null });
      fetchTravels();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <>
    <div className='absulute top-0 left-0 w-full'>
      <Header
        text="Edit Travel"
        navLinks={[
          { label: 'Dashboard', path: '/admin' },
          { label: 'Travel List', path: '/editTravel' },
          { label: 'Create Travel', path: '/createTravel' },
        ]}
      />
    </div>
    <Paper sx={{ p: 2 }}>
      <TextField
        fullWidth
        label="Search by Name"
        value={search}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Position</strong></TableCell>
              <TableCell><strong>Station</strong></TableCell>
              <TableCell><strong>Destination</strong></TableCell>
              <TableCell><strong>PDF</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.fullname || 'N/A'}</TableCell>
                <TableCell>{t.PositionDesignation}</TableCell>
                <TableCell>{t.Station}</TableCell>
                <TableCell>{t.Destination}</TableCell>
                <TableCell>
                  {t.Attachment ? (
                    <a
                      href={`http://localhost:5000${t.Attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                      View
                    </a>
                  ) : 'None'}
                </TableCell>
                <TableCell sx={{ display: 'flex' }}>
                  <IconButton onClick={() => setEditDialog({ open: true, data: { ...t } })}><EditIcon /></IconButton>

                  <IconButton onClick={() => setDeleteDialog({ open: true, id: t.id })}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, data: null })} maxWidth="sm" fullWidth>
  <DialogTitle>Edit Travel Details</DialogTitle>
  <TableContainer sx={{ p: 2 }}>
    {editDialog.data && (
      <>
        <TextField
          label="Position"
          fullWidth
          margin="normal"
          value={editDialog.data.PositionDesignation}
          onChange={(e) =>
            setEditDialog(prev => ({ ...prev, data: { ...prev.data, PositionDesignation: e.target.value } }))
          }
        />
        <TextField
          label="Station"
          fullWidth
          margin="normal"
          value={editDialog.data.Station}
          onChange={(e) =>
            setEditDialog(prev => ({ ...prev, data: { ...prev.data, Station: e.target.value } }))
          }
        />
        <TextField
          label="Destination"
          fullWidth
          margin="normal"
          value={editDialog.data.Destination}
          onChange={(e) =>
            setEditDialog(prev => ({ ...prev, data: { ...prev.data, Destination: e.target.value } }))
          }
          
        />
        <TextField
  label="Purpose"
  fullWidth
  margin="normal"
  value={editDialog.data.Purpose || ''}
  onChange={(e) =>
    setEditDialog(prev => ({ ...prev, data: { ...prev.data, Purpose: e.target.value } }))
  }
/>
<TextField
  label="Host"
  fullWidth
  margin="normal"
  value={editDialog.data.Host || ''}
  onChange={(e) =>
    setEditDialog(prev => ({ ...prev, data: { ...prev.data, Host: e.target.value } }))
  }
/>
<TextField
  label="Source of Fund"
  fullWidth
  margin="normal"
  value={editDialog.data.sof || ''}
  onChange={(e) =>
    setEditDialog(prev => ({ ...prev, data: { ...prev.data, sof: e.target.value } }))
  }
/>
<FormControl fullWidth margin="normal">
  <InputLabel id="area-select-label">Area</InputLabel>
  <Select
    labelId="area-select-label"
    value={editDialog.data.Area || ''}
    label="Area"
    onChange={(e) =>
      setEditDialog(prev => ({
        ...prev,
        data: { ...prev.data, Area: e.target.value }
      }))
    }
  >
    <MenuItem value="Division">Division</MenuItem>
    <MenuItem value="Region">Region</MenuItem>
    <MenuItem value="National">National</MenuItem>
    <MenuItem value="Abroad">Abroad</MenuItem>
  </Select>
</FormControl>

<TextField
  label="Date From"
  type="date"
  fullWidth
  margin="normal"
  value={editDialog.data.DatesFrom?.slice(0, 10) || ''}
  onChange={(e) =>
    setEditDialog(prev => ({ ...prev, data: { ...prev.data, DatesFrom: e.target.value } }))
  }
/>
<TextField
  label="Date To"
  type="date"
  fullWidth
  margin="normal"
  value={editDialog.data.DatesTo?.slice(0, 10) || ''}
  onChange={(e) =>
    setEditDialog(prev => ({ ...prev, data: { ...prev.data, DatesTo: e.target.value } }))
  }
/>

        <Button component="label" sx={{ mt: 2 }}>
          Upload New PDF
          <input type="file" accept="application/pdf" hidden onChange={(e) => setEditFile(e.target.files[0])} />
        </Button>
      </>
    )}
  </TableContainer>
  <DialogActions>
    <Button onClick={() => setEditDialog({ open: false, data: null })}>Cancel</Button>
    <Button onClick={async () => {
      try {
        const formData = new FormData();
        formData.append('PositionDesignation', editDialog.data.PositionDesignation);
formData.append('Station', editDialog.data.Station);
formData.append('Destination', editDialog.data.Destination);
formData.append('Purpose', editDialog.data.Purpose);
formData.append('Host', editDialog.data.Host);
formData.append('sof', editDialog.data.sof);
formData.append('Area', editDialog.data.Area);
formData.append('DatesFrom', editDialog.data.DatesFrom);
formData.append('DatesTo', editDialog.data.DatesTo);
if (editFile) formData.append('attachment', editFile);

        await axios.put(`http://localhost:5000/api/travels/${editDialog.data.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setEditDialog({ open: false, data: null });
        setEditFile(null);
        fetchTravels();
      } catch (err) {
        console.error('Update failed:', err);
        alert('Failed to update travel info.');
      }
    }} variant="contained">Save</Button>
  </DialogActions>
</Dialog>

    </Paper>
    </>
  );
};


export default AdminTravelTable;
