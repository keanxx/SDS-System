import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const monthLabels = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const LineGraphAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2025'); // Default to 2025
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);

        // Extract unique years (starting from 2025 only)
        const years = Array.from(
          new Set(
            res.data
              .map((item) => {
                const date = dayjs(item.DateSigned).utc(); // Parse as UTC
                return date.isValid() ? date.year() : null;
              })
              .filter((year) => year >= 2025)
          )
        ).sort((a, b) => b - a); // Descending

        setYearOptions(years);
        if (years.includes(2025)) setSelectedYear('2025');
        else if (years.length > 0) setSelectedYear(years[0]);
      })
      .catch((err) => {
        console.error('Error fetching appointments:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const monthCounts = Array(12).fill(0); // 12 months

    appointments.forEach((item) => {
      if (!item.DateSigned) return;
      const date = dayjs(item.DateSigned).utc(); // Parse as UTC
      if (date.isValid() && date.year().toString() === selectedYear) {
        const monthIndex = date.month(); // 0 to 11
        monthCounts[monthIndex]++;
      }
    });

    setGraphData({
      labels: monthLabels,
      datasets: [
        {
          label: `Appointments in ${selectedYear}`,
          data: monthCounts,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.3)',
          fill: true,
          tension: 0.3,
        },
      ],
    });
  }, [appointments, selectedYear]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3, boxShadow: 2, bgcolor: 'white', borderRadius: 2 }}>
      <Typography variant="h5" mb={2}>
        Monthly Appointment Count
      </Typography>

      {/* Year Filter */}
      <Box sx={{ maxWidth: 200, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {yearOptions.map((year, idx) => (
              <MenuItem key={idx} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : graphData ? (
        <Line data={graphData} />
      ) : (
        <Typography>No data available.</Typography>
      )}
    </Box>
  );
};

export default LineGraphAppointment;
