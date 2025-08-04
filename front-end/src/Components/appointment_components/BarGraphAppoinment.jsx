import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
} from '@mui/material';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
dayjs.extend(isoWeek);

const BarGraphAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [groupBy, setGroupBy] = useState('monthly');
  const [natureFilter, setNatureFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [schoolFilter, setSchoolFilter] = useState('All');

  const [barData, setBarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [natureOptions, setNatureOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${baseURL}/api/appointments`)
      .then(res => {
        setAppointments(res.data);
        setLoading(false);

        const natures = Array.from(new Set(res.data.map(item => item.NatureAppointment))).filter(Boolean);
        const districts = Array.from(new Set(res.data.map(item => item.District))).filter(Boolean);
        const schools = Array.from(new Set(res.data.map(item => item.SchoolOffice))).filter(Boolean);

        setNatureOptions(natures);
        setDistrictOptions(districts);
        setSchoolOptions(schools);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  // 👉 Dynamic School Filter based on District
  useEffect(() => {
    if (districtFilter === 'All') {
      const allSchools = Array.from(
        new Set(appointments.map(item => item.SchoolOffice))
      ).filter(Boolean);
      setSchoolOptions(allSchools);
    } else {
      const filteredSchools = Array.from(
        new Set(
          appointments
            .filter(item => item.District === districtFilter)
            .map(item => item.SchoolOffice)
        )
      ).filter(Boolean);
      setSchoolOptions(filteredSchools);
    }

    setSchoolFilter('All'); // reset school filter
  }, [districtFilter, appointments]);

  useEffect(() => {
    const grouped = {};

    const filtered = appointments.filter(item => {
      const matchesNature = natureFilter === 'All' || item.NatureAppointment === natureFilter;
      const matchesDistrict = districtFilter === 'All' || item.District === districtFilter;
      const matchesSchool = schoolFilter === 'All' || item.SchoolOffice === schoolFilter;
      return matchesNature && matchesDistrict && matchesSchool;
    });

    filtered.forEach((item) => {
      if (!item.DateSigned || !item.NatureAppointment) return;

      const date = dayjs(item.DateSigned);
      if (!date.isValid()) return;

      let key = '';
      if (groupBy === 'weekly') {
        key = date.startOf('week').format('YYYY-MM-DD');
      } else if (groupBy === 'monthly') {
        key = date.format('YYYY-MM');
      } else if (groupBy === 'yearly') {
        key = date.format('YYYY');
      }

      if (!grouped[key]) grouped[key] = {};
      const nature = item.NatureAppointment;
      grouped[key][nature] = (grouped[key][nature] || 0) + 1;
    });

    const labels = Object.keys(grouped).sort();
    const datasetsMap = {};

    labels.forEach(label => {
      const entry = grouped[label];
      Object.keys(entry).forEach(nature => {
        if (!datasetsMap[nature]) datasetsMap[nature] = [];
      });
    });

    Object.keys(datasetsMap).forEach(nature => {
      datasetsMap[nature] = labels.map(label => grouped[label]?.[nature] || 0);
    });

    const colors = [
      '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc',
      '#ef5350', '#26c6da', '#ff7043', '#8d6e63',
    ];

    const datasets = Object.keys(datasetsMap).map((nature, index) => ({
      label: nature,
      data: datasetsMap[nature],
      backgroundColor: colors[index % colors.length],
    }));

    setBarData({ labels, datasets });
  }, [appointments, groupBy, natureFilter, districtFilter, schoolFilter]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2, boxShadow: 2, bgcolor: 'white', borderRadius: 2 }}>
      <Typography variant="h5" mb={3}>
        Appointment Summary ({groupBy.charAt(0).toUpperCase() + groupBy.slice(1)})
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select value={groupBy} label="Sort By" onChange={(e) => setGroupBy(e.target.value)}>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 220, maxWidth: 220 }} size="small">
          <InputLabel>Nature of Appointment</InputLabel>
          <Select
            value={natureFilter}
            label="Nature of Appointment"
            onChange={(e) => setNatureFilter(e.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  maxWidth: 220,
                  width: 220,
                },
              },
            }}
          >
            <MenuItem value="All">All Nature</MenuItem>
            {natureOptions.map((nature, idx) => (
              <MenuItem key={idx} value={nature}>
                <Box sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {nature}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 220, maxWidth: 220 }} size="small">
          <InputLabel>District</InputLabel>
          <Select
            value={districtFilter}
            label="District"
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            <MenuItem value="All">All Districts</MenuItem>
            {districtOptions.map((district, idx) => (
              <MenuItem key={idx} value={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 220, maxWidth: 220 }} size="small">
          <InputLabel>Schools</InputLabel>
          <Select
            value={schoolFilter}
            label="Schools"
            onChange={(e) => setSchoolFilter(e.target.value)}
          >
            <MenuItem value="All">All Schools</MenuItem>
            {schoolOptions.map((school, idx) => (
              <MenuItem key={idx} value={school}>
                <Box sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {school}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : barData ? (
        <Bar data={barData} />
      ) : (
        <Typography>No data to display.</Typography>
      )}
    </Box>
  );
};

export default BarGraphAppointment;
