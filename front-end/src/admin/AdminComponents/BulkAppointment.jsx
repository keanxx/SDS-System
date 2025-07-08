import React, { useState, useRef } from 'react';
import {
  Button,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';

const BulkAppointmentUpload = () => {
  const fileInputRef = useRef();
  const [action, setAction] = useState(null); // 'upload' or 'update'
  const [selectedFile, setSelectedFile] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const formatDate = (value) => {
    if (!value) return null;
    if (typeof value === 'number') {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (!parsed) return null;
      return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
    }

    const date = new Date(value);
    if (isNaN(date)) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const processFile = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const formattedRows = rows.map(row => ({
        id: row.id || undefined,
        Name: row.Name || '',
        PositionTitle: row.PositionTitle || '',
        SchoolOffice: row.SchoolOffice || '',
        District: row.District || '',
        StatusOfAppointment: row.StatusOfAppointment || '',
        NatureAppointment: row.NatureAppointment || '',
        ItemNo: row.ItemNo || '',
        DateSigned: formatDate(row.DateSigned)
      }));

      try {
        if (action === 'upload') {
          const res = await axios.post('http://localhost:5000/api/appointments/bulk-json', formattedRows, {
            headers: { 'Content-Type': 'application/json' }
          });
          alert(res.data.message || 'Upload successful!');
        } else if (action === 'update') {
          const res = await axios.put('http://localhost:5000/api/appointments/bulk-update', formattedRows, {
            headers: { 'Content-Type': 'application/json' }
          });
          alert(res.data.message || 'Update successful!');
        }
      } catch (err) {
        console.error(`${action} failed:`, err);
        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} failed.`);
      }

      fileInputRef.current.value = '';
      setAction(null);
      setSelectedFile(null);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOpenConfirm(true);
    }
  };

  const handleConfirm = () => {
    setOpenConfirm(false);
    if (selectedFile && action) {
      processFile(selectedFile);
    }
  };

  const handleCancel = () => {
    setOpenConfirm(false);
    setSelectedFile(null);
    setAction(null);
    fileInputRef.current.value = '';
  };

  const triggerFileInput = (type) => {
    setAction(type);
    fileInputRef.current.click();
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" color="primary" onClick={() => triggerFileInput('upload')}>
          Upload
        </Button>
        <Button variant="contained" color="secondary" onClick={() => triggerFileInput('update')}>
          Update
        </Button>
      </Stack>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={handleCancel}>
        <DialogTitle>Confirm {action === 'upload' ? 'Upload' : 'Update'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {action} the selected Excel file?
            This action will {action === 'upload' ? 'add new records' : 'update existing records'}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color={action === 'upload' ? 'primary' : 'secondary'}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkAppointmentUpload;
