const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint to fetch schools and their associated districts
router.get('/schools-w-district', async (req, res) => {
  try {
    const sql = `
      SELECT 
        schools.school_id, 
        schools.name AS school_name, 
        district.id AS district_id, 
        district.name AS district_name
      FROM 
        schools
      JOIN 
        district ON schools.district_id = district.id
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error('Database Query Error:', err);
        return res.status(500).json({ error: 'Failed to fetch schools and districts.' });
      }
      
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Server error occurred.' });
  }
});

module.exports = router;