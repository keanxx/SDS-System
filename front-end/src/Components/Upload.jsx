import React, { useState } from 'react';
import {
  Button,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography
} from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { CloudUploadOutlined } from '@mui/icons-material';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadData, setUploadData] = useState([]);
  const [uploadPreview, setUploadPreview] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadError(null);
    setUploadSuccess(false);

    const file = event.target.files[0];
    if (!file) return;

    const isCSV = file.name.endsWith('.csv');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let workbook;
        if (isCSV) {
          workbook = XLSX.read(e.target.result, { type: 'binary' });
        } else {
          const data = new Uint8Array(e.target.result);
          workbook = XLSX.read(data, { type: 'array' });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet);

        if (excelData.length === 0) {
          setUploadError('No data found in the file.');
          return;
        }

        // ✅ Match frontend fields to backend expectations
        const formattedData = excelData.map(row => ({
          employeeID: row.employee_id || row.employeeID || row.EmployeeID || row.Employee_ID || '',
          positiondesignation: row.positiondesignation || row.PositionDesignation || row.position || row.Position || '',
          station: row.station || row.Station || '',
          purpose: row.purpose || row.Purpose || '',
          host: row.host || row.Host || '',
          fromDate: formatExcelDate(row.fromDate || row.datesfrom || row.DatesFrom || row.FromDate || ''),
          toDate: formatExcelDate(row.toDate || row.datesto || row.DatesTo || row.ToDate || ''),
          destination: row.destination || row.Destination || '',
          area: row.area || row.Area || '',
          sof: row.sof || row.SOF || row.SourceOfFund || ''
          
          
        }));

        const invalidEntries = formattedData.filter(entry =>
          !entry.employeeID ||
          !entry.positiondesignation ||
          !entry.station ||
          !entry.purpose ||
          !entry.host ||
          !entry.fromDate ||
          !entry.toDate ||
          !entry.destination ||
          !entry.area ||
          !entry.sof
        );

        if (invalidEntries.length > 0) {
          setUploadError(`${invalidEntries.length} entries are missing required fields.`);
          return;
        }

        setUploadData(formattedData);
        setUploadPreview(formattedData.slice(0, 5));
        setOpenDialog(true);

      } catch (error) {
        console.error('Error parsing file:', error);
        setUploadError('Failed to parse the file. Please check the format.');
      }
    };

    isCSV ? reader.readAsBinaryString(file) : reader.readAsArrayBuffer(file);
  };

  const formatExcelDate = (value) => {
    if (!value) return '';

    if (typeof value === 'string' && value.includes('/')) {
      const [day, month, year] = value.split('/');
      if (day && month && year) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    if (typeof value === 'number' || value instanceof Date) {
      let date = typeof value === 'number'
        ? new Date((value - 25569) * 86400 * 1000)
        : value;

      return date.toISOString().split('T')[0];
    }

    return String(value);
  };

  const handleUpload = async () => {
    if (!uploadData.length) return;

    setUploading(true);
    setUploadError(null);

    try {
      const response = await axios.post(
        'http://192.168.83.141:3000/travels/bulk',
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setUploadSuccess(true);
      setOpenDialog(false);
      console.log('Bulk upload successful:', response.data);
    } catch (error) {
      console.error('Bulk upload error:', error);
      const errorDetail = error.response?.data?.error ||
                          error.response?.data?.message ||
                          error.response?.data ||
                          error.message ||
                          'Failed to upload travel details';

      setUploadError(
        typeof errorDetail === 'object'
          ? JSON.stringify(errorDetail)
          : errorDetail
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-md border-green-500/30 border rounded-lg p-8 max-w-lg mx-auto">
      <section>
        <h1 className='text-xl font-semibold text-center p-5'>Upload Travel Data</h1>

        {uploadSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Travel data uploaded successfully!
          </Alert>
        )}

        {uploadError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {uploadError}
          </Alert>
        )}

        <form className='flex flex-col space-y-5'>
          <Stack direction="column" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadOutlined />}
              sx={{ width: '200px' }}
            >
              Choose Excel File
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {selectedFile && (
              <Typography variant="body2" color="textSecondary">
                Selected: {selectedFile.name}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
              disabled={!selectedFile}
              sx={{ width: '200px' }}
            >
              {uploading ? <CircularProgress size={24} /> : "Review & Upload"}
            </Button>
          </Stack>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Note: Only .xlsx and .xls files are allowed.</p>
          <p className="mt-1">File should contain columns for: Employee ID, Position, Station, Purpose, etc.</p>
        </div>
      </section>

      <Dialog
        open={openDialog}
        onClose={() => !uploading && setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Review Travel Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to upload {uploadData.length} travel entries. Here's a preview of the first {uploadPreview.length} entries:
          </DialogContentText>
          <Box sx={{ mt: 2, maxHeight: '50vh', overflow: 'auto' }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source of Fund</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploadPreview.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.employeeID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.positiondesignation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.station}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.fromDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.toDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.sof}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={uploading}
          >
            {uploading ? <CircularProgress size={24} /> : "Confirm Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Upload;
