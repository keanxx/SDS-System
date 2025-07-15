const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const XLSX = require('xlsx');

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ----------------- ROUTES -----------------


// Get all appointments
router.get('/appointments', (req, res) => {
  const sql = `
    SELECT 
      ad.*, 
      ar.releasedAt 
    FROM \`appointment-details\` ad
    LEFT JOIN \`appointment-releases\` ar 
    ON ad.id = ar.appointmentId
    GROUP BY ad.id; -- Ensure uniqueness
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.status(200).json(results);
  });
});

// Remarks endpoint
router.put('/appointment/:id/remarks', (req, res) => {
  const { remarks } = req.body;
  const id = req.params.id;

  const sql = 'UPDATE `appointment-details` SET remarks = ? WHERE id = ?';
  db.query(sql, [remarks, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update remarks.' });
    res.status(200).json({ message: 'Remarks updated successfully!' });
  });
});

// Release appointment
router.post('/appointment/:id/release', (req, res) => {
  const id = req.params.id;

  const sqlCheck = 'SELECT id FROM `appointment-details` WHERE id = ?';
  db.query(sqlCheck, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error during check.' });
    if (results.length === 0) return res.status(404).json({ error: 'Appointment not found.' });

    const sqlInsert = `
      INSERT INTO \`appointment-releases\` (appointmentId, releasedAt)
      VALUES (?, NOW())
    `;

    db.query(sqlInsert, [id], (insertErr) => {
      if (insertErr) return res.status(500).json({ error: 'Database error during release.' });
      res.status(200).json({ message: 'Appointment released successfully!' });
    });
  });
});

// Get release information
router.get('/appointment/:id/release-info', (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT releasedAt
    FROM \`appointment-releases\`
    WHERE appointmentId = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (results.length === 0) return res.status(404).json({ error: 'No release information found for this appointment.' });

    res.status(200).json({ releasedAt: results[0].releasedAt });
  });
});

// Create appointment (with optional PDF)
router.post('/appointment', upload.single('pdf'), (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  console.log('Uploaded File:', req.file); // Log the uploaded file

  const {
    name,
    positionTitle,
    schoolOffice,
    district,
    statusOfAppointment,
    natureAppointment,
    itemNo,
    dateSigned,
    remarks // Include remarks in the request body
  } = req.body;

  const pdfPath = req.file ? `uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO \`appointment-details\` 
    (Name, PositionTitle, SchoolOffice, District, StatusOfAppointment, NatureAppointment, ItemNo, DateSigned, pdfPath, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, positionTitle, schoolOffice, district, statusOfAppointment, natureAppointment, itemNo, dateSigned, pdfPath, remarks], // Include remarks here
    (err, result) => {
      if (err) {
        console.error('Database Insert Error:', err); // Log the database error
        return res.status(500).json({ error: 'Database insert error.' });
      }
      res.status(201).json({ message: 'Appointment created successfully!', id: result.insertId });
    }
  );
});
// Update appointment (with optional PDF replacement)
router.put('/appointment/:id', upload.single('pdf'), (req, res) => {
  const id = req.params.id;
  const {
    name,
    positionTitle,
    schoolOffice,
    statusOfAppointment,
    natureAppointment,
    itemNo,
    dateSigned
  } = req.body;

  const pdfPath = req.file ? `uploads/${req.file.filename}` : null;

  const sql = `
    UPDATE \`appointment-details\`
    SET 
      Name = ?, 
      PositionTitle = ?, 
      SchoolOffice = ?, 
      StatusOfAppointment = ?, 
      NatureAppointment = ?, 
      ItemNo = ?, 
      DateSigned = ?, 
      pdfPath = COALESCE(?, pdfPath)
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      positionTitle,
      schoolOffice,
      statusOfAppointment,
      natureAppointment,
      itemNo,
      dateSigned,
      pdfPath,
      id
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error.' });
      res.status(200).json({ message: 'Appointment updated successfully!' });
    }
  );
});

// Delete appointment + delete PDF if exists
router.delete('/appointment/:id', (req, res) => {
  const id = req.params.id;

  const getSql = 'SELECT pdfPath FROM `appointment-details` WHERE id = ?';
  db.query(getSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching appointment.' });
    if (results.length === 0) return res.status(404).json({ error: 'Appointment not found.' });

    const pdfPath = results[0].pdfPath;

    const deleteSql = 'DELETE FROM `appointment-details` WHERE id = ?';
    db.query(deleteSql, [id], (err) => {
      if (err) return res.status(500).json({ error: 'Database error during delete.' });

      if (pdfPath) {
        const fullPath = path.join(__dirname, '..', pdfPath);
        fs.unlink(fullPath, (fsErr) => {
          if (fsErr && fsErr.code !== 'ENOENT') {
            console.warn('PDF deletion error:', fsErr);
          }
        });
      }

      res.status(200).json({ message: 'Appointment and PDF deleted successfully!' });
    });
  });
});

// Bulk insert (Excel/CSV file)
router.post('/appointments/bulk', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data.length) return res.status(400).json({ error: 'Empty or invalid file.' });

    const values = data.map(row => [
      row.Name || '',
      row.PositionTitle || '',
      row.SchoolOffice || '',
      row.District || '',
      row.StatusOfAppointment || '',
      row.NatureAppointment || '',
      row.ItemNo || '',
      row.DateSigned || null,
      row.remarks || '' // Include remarks with a default value if not provided
    ]);

    const sql = `
      INSERT INTO \`appointment-details\`
      (Name, PositionTitle, SchoolOffice, District, StatusOfAppointment, NatureAppointment, ItemNo, DateSigned, remarks)
      VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database insertion failed.' });
      res.status(200).json({ message: `Inserted ${result.affectedRows} appointments.` });
    });

  } catch (err) {
    res.status(500).json({ error: 'File processing failed.' });
  }
});

// Bulk insert from JSON
router.post('/appointments/bulk-json', (req, res) => {
  const appointments = req.body;

  if (!Array.isArray(appointments) || appointments.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty data.' });
  }

  const values = appointments.map(row => [
    row.Name || '',
    row.PositionTitle || '',
    row.SchoolOffice || '',
    row.District || '',
    row.StatusOfAppointment || '',
    row.NatureAppointment || '',
    row.ItemNo || '',
    row.DateSigned || null,
    row.remarks || '' // Include remarks with a default value if not provided
  ]);

  const sql = `
    INSERT INTO \`appointment-details\` 
    (Name, PositionTitle, SchoolOffice, District, StatusOfAppointment, NatureAppointment, ItemNo, DateSigned, remarks)
    VALUES ?
  `;

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Database insertion error:', err);
      return res.status(500).json({ error: 'Database insertion failed.' });
    }
    res.status(200).json({ message: `Inserted ${result.affectedRows} appointments.` });
  });
});

// Bulk upsert: update if exists (by ItemNo), insert if not
router.post('/appointments/bulk-update', (req, res) => {
  const appointments = req.body;

  if (!Array.isArray(appointments) || appointments.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty update payload.' });
  }

  const values = appointments.map(row => [
    row.Name || '',
    row.PositionTitle || '',
    row.SchoolOffice || '',
    row.District || '',
    row.StatusOfAppointment || '',
    row.NatureAppointment || '',
    row.ItemNo || '',
    row.DateSigned || null,
    row.remarks || '' // Include remarks with a default value if not provided
  ]);

  const sql = `
    INSERT INTO \`appointment-details\` 
      (Name, PositionTitle, SchoolOffice, District, StatusOfAppointment, NatureAppointment, ItemNo, DateSigned, remarks)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      Name = VALUES(Name),
      PositionTitle = VALUES(PositionTitle),
      SchoolOffice = VALUES(SchoolOffice),
      District = VALUES(District),
      StatusOfAppointment = VALUES(StatusOfAppointment),
      NatureAppointment = VALUES(NatureAppointment),
      DateSigned = VALUES(DateSigned),
      remarks = VALUES(remarks) -- Ensure remarks is updated
  `;

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Upsert error:', err);
      return res.status(500).json({ error: 'Bulk upsert failed.' });
    }

    res.status(200).json({ message: `Bulk update complete. ${result.affectedRows} rows affected.` });
  });
});



// Get all schools with district info
router.get('/schools', (req, res) => {
  const sql = `
    SELECT
      s.schoolID,
      s.name AS schoolname,
      d.name AS district
    FROM
      schools s
    INNER JOIN
      district d ON s.districtID = d.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch schools.' });
    res.status(200).json(results);
  });
});


// Release appointment
router.post('/appointment/:id/release', (req, res) => {
  const id = req.params.id;

  const sqlCheck = 'SELECT id FROM `appointment-details` WHERE id = ?';
  db.query(sqlCheck, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error during check.' });
    if (results.length === 0) return res.status(404).json({ error: 'Appointment not found.' });

    const sqlInsert = `
      INSERT INTO \`appointment-releases\` (appointmentId, releasedAt)
      VALUES (?, NOW())
    `;

    db.query(sqlInsert, [id], (insertErr) => {
      if (insertErr) return res.status(500).json({ error: 'Database error during release.' });
      res.status(200).json({ message: 'Appointment released successfully!' });
    });
  });
});

// Get release information
router.get('/appointment/:id/release-info', (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT releasedAt
    FROM \`appointment-releases\`
    WHERE appointmentId = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    if (results.length === 0) return res.status(404).json({ error: 'No release information found for this appointment.' });

    res.status(200).json({ releasedAt: results[0].releasedAt });
  });
});


module.exports = router;
