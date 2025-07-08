import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';

const PieChartAppointment = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/appointments');
        if (Array.isArray(res.data)) {
          const districtCounts = {};

          res.data.forEach(row => {
            const district = row?.District?.trim() || 'Unknown';
            districtCounts[district] = (districtCounts[district] || 0) + 1;
          });

          // Format data for PieChart
          const formatted = Object.entries(districtCounts).map(([name, value], index) => ({
            id: index,
            value,
            label: name,
          }));

          setChartData(formatted);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', textAlign: 'center', mt: 5 }}>
      <Typography variant="h6" gutterBottom>
        Appointments by District
      </Typography>

      {chartData.length > 0 ? (
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 40,
              outerRadius: 120,
              paddingAngle: 3,
              cornerRadius: 4,
              startAngle: -90,
              endAngle: 270,
              cx: 150,
              cy: 150,
            },
          ]}
          width={300}
          height={300}
        />
      ) : (
        <Typography variant="body1">Loading chart...</Typography>
      )}
    </Box>
  );
};

export default PieChartAppointment;