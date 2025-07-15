const express = require('express');
const db = require('../db'); 
const router = express.Router();


router.get('/employees', (req, res) => {
  const sql = 'SELECT * FROM `employee`';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error.' });
    res.status(200).json(results);
  });
});

module.exports = router;
