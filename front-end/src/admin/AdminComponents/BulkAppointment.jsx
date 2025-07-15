import React, { useState, useRef } from 'react';
import {
  Button,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress
} from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';

const BulkAppointmentUpload = () => {
  const fileInputRef = useRef();
  const [action, setAction] = useState(null); // 'upload' or 'update'
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (value) => {
    if (!value) return null;
    if (typeof value === 'number') {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (!parsed) return null;
      return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
    }
    const date = new Date(value);
    return isNaN(date) ? null : date.toISOString().split('T')[0];
  };

  const validateColumns = (rows) => {
    const requiredColumns = [
      'Name',
      'PositionTitle',
      'SchoolOffice',
      'District',
      'StatusOfAppointment',
      'NatureAppointment',
      'ItemNo',
      'DateSigned',
      'remarks'
    ];
    const missingColumns = requiredColumns.filter(
      (col) => !rows[0]?.hasOwnProperty(col)
    );
    return missingColumns;
  };

  const parseFile = async (file) => {
    setLoading(true); // Show loading indicator
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      let rows = [];

      if (file.name.endsWith('.csv')) {
        const text = new TextDecoder().decode(data);
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        rows = lines.slice(1).map((line) => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
            return obj;
          }, {});
        });
      } else {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      }

      const missingColumns = validateColumns(rows);
      if (missingColumns.length > 0) {
        alert(`Missing mandatory columns: ${missingColumns.join(', ')}`);
        setLoading(false); // Hide loading indicator
        return;
      }

      const formattedRows = rows.map((row) => ({
        Name: row.Name || '',
        PositionTitle: row.PositionTitle || '',
        SchoolOffice: row.SchoolOffice || '',
        District: row.District || '',
        StatusOfAppointment: row.StatusOfAppointment || '',
        NatureAppointment: row.NatureAppointment || '',
        ItemNo: row.ItemNo || '',
        DateSigned: formatDate(row.DateSigned),
        remarks: row.remarks || '' // Add remarks field
      }));

      setParsedData(formattedRows);
      setPreviewData(formattedRows.slice(0, 5));
      setOpenDialog(true);
      setLoading(false); // Hide loading indicator
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      parseFile(file);
    }
  };

  const triggerFileInput = (type) => {
    setAction(type);
    fileInputRef.current.click();
  };

  const cancelFileSelection = () => {
    setSelectedFile(null);
    setParsedData([]);
    setPreviewData([]);
    setOpenDialog(false);
  };

  const handleUploadOrUpdate = async () => {
    if (!parsedData.length || !action) return;
    setLoading(true);
    try {
      const url =
        action === 'upload'
          ? 'http://localhost:5000/api/appointments/bulk-json'
          : 'http://localhost:5000/api/appointments/bulk-update';

      const res = await axios.post(url, parsedData, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert(res.data.message || `${action} successful!`);
    } catch (err) {
      console.error(`${action} failed:`, err);

      if (err.response?.status === 400) {
        alert('Bad request: Check your file formatting.');
      } else if (err.response?.status === 500) {
        alert('Internal server error: Please contact support.');
      } else {
        alert(`${action} failed: Unknown error.`);
      }
    } finally {
      setLoading(false);
      setOpenDialog(false);
      setSelectedFile(null);
      setParsedData([]);
      setAction(null);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => triggerFileInput('upload')}
        >
          Upload
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => triggerFileInput('update')}
        >
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

      {/* Review Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !loading && setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Review {action === 'upload' ? 'Upload' : 'Update'} Data
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {parsedData.length} records found. Here's a preview of the first{' '}
            {previewData.length}:
          </DialogContentText>
          <Box mt={2} maxHeight="300px" overflow="auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    'Name',
                    'PositionTitle',
                    'SchoolOffice',
                    'District',
                    'StatusOfAppointment',
                    'NatureAppointment',
                    'ItemNo',
                    'DateSigned',
                    'remarks'
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-2 text-left text-xs font-bold text-gray-600"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 text-sm">{row.Name}</td>
                    <td className="px-4 py-2 text-sm">{row.PositionTitle}</td>
                    <td className="px-4 py-2 text-sm">{row.SchoolOffice}</td>
                    <td className="px-4 py-2 text-sm">{row.District}</td>
                    <td className="px-4 py-2 text-sm">
                      {row.StatusOfAppointment}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {row.NatureAppointment}
                    </td>
                    <td className="px-4 py-2 text-sm">{row.ItemNo}</td>
                    <td className="px-4 py-2 text-sm">{row.DateSigned}</td>
                    <td className="px-4 py-2 text-sm">{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelFileSelection} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleUploadOrUpdate}
            variant="contained"
            color={action === 'upload' ? 'primary' : 'secondary'}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkAppointmentUpload;