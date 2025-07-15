import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';

const OverviewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching appointments:', err);
        setLoading(false);
      });
  }, []);

  const totalAppointments = appointments.length;


  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const appointmentsThisMonth = appointments.filter(app => {
    if (!app.DateSigned) return false;
    const date = new Date(app.DateSigned);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  }).length;

  const commonNature = () => {
    const counts = {};
    appointments.forEach(app => {
      if (app.NatureAppointment) {
        counts[app.NatureAppointment] = (counts[app.NatureAppointment] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || 'N/A';
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 4 , boxShadow: 2, bgcolor: 'white', borderRadius: 2, mb: 3}}>
      <Typography variant="h5" mb={3}>Overview</Typography>
      <Grid container spacing={3}>
        <OverviewCard title="Total Appointments" value={totalAppointments} color="#1976d2" />
      
        
      </Grid>
    </Box>
  );
};

const OverviewCard = ({ title, value, color }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ borderLeft: `6px solid ${color}`, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>{title}</Typography>
        <Typography variant="h5" fontWeight="bold" color={color}>{value}</Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default OverviewAppointment;
