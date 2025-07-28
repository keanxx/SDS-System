import React, { useState } from 'react';
import {
  Button, Stack, Alert, CircularProgress,
  Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Box, Typography
} from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';

export default function BulkTravel() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [preview, setPreview] = useState([]);
  const [mode, setMode] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL;

  const formatDate = v => {
    if (!v) return '';
    if (typeof v === 'number') {
      const dt = XLSX.SSF.parse_date_code(v);
      return `${dt.y}-${String(dt.m).padStart(2,'0')}-${String(dt.d).padStart(2,'0')}`;
    }
    const d = new Date(v);
    return isNaN(d) ? '' : d.toISOString().split('T')[0];
  };

  const handleFile = async e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const buf = await f.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    const fData = rows.map(r => ({
      employee_ID: r.employee_ID || '',
      PositionDesignation: r.PositionDesignation || '',
      Station: r.Station || '',
      Purpose: r.Purpose || '',
      Host: r.Host || '',
      DatesFrom: formatDate(r.DatesFrom),
      DatesTo: formatDate(r.DatesTo),
      Destination: r.Destination || '',
      Area: r.Area || '',
      sof: r.sof || r.SOF || ''
    })).filter(r => r.employee_ID && r.DatesFrom && r.DatesTo);

    setData(fData);
    setPreview(fData.slice(0, 5));
  };

  const openDialog = m => {
    if (!file) return;
    setMode(m);
    setOpen(true);
  };

  const confirm = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await axios.post(
        `${baseURL}/api/travels/bulk-insert`,
        data, // <-- this should be an array of objects
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMsg(res.data.message + ` Updated: ${res.data.updated} Skipped: ${res.data.skipped}`);
    } catch (err) {
      console.error(err);
      setMsg('Error: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <Box>
      <Stack spacing={2} alignItems="center">
        <Button variant="outlined" component="label">
          Select Excel File
          <input type="file" accept=".xlsx,.xls,.csv" hidden onChange={handleFile}/>
        </Button>
        {file && <Typography>{file.name}</Typography>}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => openDialog('upsert')} disabled={!file}>
            Bulk Upsert
          </Button>
        </Stack>
        {msg && <Alert>{msg}</Alert>}
      </Stack>

      <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Confirm Bulk Upsert</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You're about to upsert {data.length} rows. Preview (first {preview.length}):
          </DialogContentText>
          <Box mt={2} maxHeight={300} overflow="auto" component="div">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {Object.keys(preview[0] || {}).map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {preview.map((r,i) => (
                  <tr key={i}>
                    {Object.values(r).map((v,j)=><td key={j}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={confirm} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24}/> : 'Confirm Upsert'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
