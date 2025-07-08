const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

const port = 5000

//conection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: "appointment"
})





//inserting data into the database

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Update an appointment + optional PDF replacement
app.put('/api/appointment/:id', upload.single('pdf'), (req, res) => {
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
      if (err) {
        console.error("Error updating appointment:", err);
        return res.status(500).json({ error: "Database error." });
      }
      res.status(200).json({ message: "Appointment updated successfully!" });
    }
  );
});


// Create a new appointment with optional PDF upload
app.post('/api/appointment', upload.single('pdf'), (req, res) => {
  const {
    name,
    positionTitle,
    schoolOffice,
    district,
    statusOfAppointment,
    natureAppointment,
    itemNo,
    dateSigned
  } = req.body;

  const pdfPath = req.file ? `uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO \`appointment-details\` 
    (Name, PositionTitle, SchoolOffice, District, StatusOfAppointment, NatureAppointment, ItemNo, DateSigned, pdfPath)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, positionTitle, schoolOffice, district, statusOfAppointment, natureAppointment, itemNo, dateSigned, pdfPath],
    (err, result) => {
      if (err) {
        console.error("Error inserting appointment:", err);
        return res.status(500).json({ error: "Database insert error." });
      }
      res.status(201).json({ message: "Appointment created successfully!", id: result.insertId });
    }
  );
});


// Accept Excel/CSV file upload
app.post('/api/appointments/bulk', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = req.file.path;

  try {
    // Read file using xlsx
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data.length) {
      return res.status(400).json({ error: 'Empty or invalid file.' });
    }

    // Prepare SQL values
    const values = data.map(row => [
      row.Name,
      row.PositionTitle,
      row.SchoolOffice,
      row.District,
      row.StatusOfAppointment,
      row.NatureAppointment,
      row.ItemNo,
      row.DateSigned || null
    ]);

    const sql = `
      INSERT INTO \`appointment-details\`
        (Name, PositionTitle, SchoolOffice, District, StatusOfAppointment, NatureAppointment, ItemNo, DateSigned)
      VALUES ?
    `;

    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Error inserting bulk appointments:', err);
        return res.status(500).json({ error: 'Database insertion failed.' });
      }

      res.status(200).json({ message: `Inserted ${result.affectedRows} appointments.` });
    });

  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).json({ error: 'File processing failed.' });
  }
});


// Bulk insert from JSON payload (not file upload)
app.post('/api/appointments/bulk-json', (req, res) => {
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
    row.DateSigned || null // Ensure null if missing
  ]);

  const sql = `
    INSERT INTO \`appointment-details\` 
    (Name, PositionTitle, SchoolOffice, District, StatusOfAppointment, NatureAppointment, ItemNo, DateSigned)
    VALUES ?
  `;

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error inserting bulk appointments from JSON:', err);
      return res.status(500).json({ error: 'Database insertion failed.' });
    }

    res.status(200).json({ message: `Inserted ${result.affectedRows} appointments.` });
  });
});

//bulk update from JSON payload
app.put('/api/appointments/bulk-update', (req, res) => {
  const updates = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty update payload.' });
  }

  const updatePromises = updates.map(appointment => {
    const {
      id,
      Name,
      PositionTitle,
      SchoolOffice,
      District,
      StatusOfAppointment,
      NatureAppointment,
      ItemNo,
      DateSigned
    } = appointment;

    const sql = `
      UPDATE \`appointment-details\` SET 
        Name = ?, 
        PositionTitle = ?, 
        SchoolOffice = ?, 
        District = ?, 
        StatusOfAppointment = ?, 
        NatureAppointment = ?, 
        ItemNo = ?, 
        DateSigned = ?
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [Name, PositionTitle, SchoolOffice, District, StatusOfAppointment, NatureAppointment, ItemNo, DateSigned, id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  });

  Promise.all(updatePromises)
    .then(() => {
      res.status(200).json({ message: 'All appointments updated successfully.' });
    })
    .catch(err => {
      console.error('Error during bulk update:', err);
      res.status(500).json({ error: 'Bulk update failed.' });
    });
});


//deletion
app.delete('/api/appointment/:id', (req, res) => {
  const id = req.params.id;

  // Step 1: Get the PDF path first
  const getSql = 'SELECT pdfPath FROM `appointment-details` WHERE id = ?';
  db.query(getSql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching PDF path:', err);
      return res.status(500).json({ error: 'Error fetching appointment.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    const pdfPath = results[0].pdfPath;

    // Step 2: Delete the appointment from the DB
    const deleteSql = 'DELETE FROM `appointment-details` WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting appointment:', err);
        return res.status(500).json({ error: 'Database error during delete.' });
      }

      // Step 3: If a PDF exists, try to delete it from the filesystem
      if (pdfPath) {
        const fullPath = path.join(__dirname, pdfPath);
        fs.unlink(fullPath, (fsErr) => {
          if (fsErr && fsErr.code !== 'ENOENT') {
            console.warn('PDF deletion error:', fsErr); // log, but don't fail
          }
        });
      }

      res.status(200).json({ message: 'Appointment and PDF deleted successfully!' });
    });
  });
});


app.get("/api/schools", (req, res) => {
  const sql = `
    SELECT
      s.schoolID,
      s.name AS schoolname,
      d.name AS district
    FROM
      schools s
    INNER JOIN
      district d
    ON
      s.districtID = d.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Failed to fetch schools." });
    }
    res.status(200).json(results);
  });
});




// viewing data in browser
app.get('/api/appointments', (req, res) => {
    const sql = 'SELECT * FROM `appointment-details`';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(200).json(results); // send data as JSON
    });
});
app.listen(port,'0.0.0.0',() => {
    console.log(`Server is running on port ${port}`);
})