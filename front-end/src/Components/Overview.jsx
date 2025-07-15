import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  ModeOfTravel,
  AirplaneTicket,
  Tour,
  AccessTime
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const Overview = () => {
  const [totalTravels, setTotalTravels] = useState(0);
  const [upcomingTravels, setUpcomingTravels] = useState(0);
  const [finishedTravels, setFinishedTravels] = useState(0);
  const [ongoingTravels, setOngoingTravels] = useState(0);
  const baseURL = import.meta.env.VITE_API_URL ;

  useEffect(() => {
    axios.get(`${baseURL}/api/travels`) // Adjust the URL to your API endpoint
      .then((res) => {
        const travels = res.data;
        setTotalTravels(travels.length);

        const today = dayjs();
        let upcoming = 0;
        let finished = 0;
        let ongoing = 0;

        travels.forEach(travel => {
          const dateFrom = dayjs(travel.DatesFrom);
          const dateTo = dayjs(travel.DatesTo);

          // Categorize travel
          if (dateFrom.isAfter(today, 'day')) {
            upcoming += 1;
          } else if (dateTo.isBefore(today, 'day')) {
            finished += 1;
          } else {
            ongoing += 1;
          }
        });

        setUpcomingTravels(upcoming);
        setFinishedTravels(finished);
        setOngoingTravels(ongoing);
      })
      .catch((err) => {
        console.error('Failed to fetch travels:', err);
      });
  }, []);

  return (
    <>
    <div className='flex justify-center items-center p-5 flex-wrap gap-5'>
      {/* Total Travels */}
      <Box>
        <Card sx={{ width: 200, height: 180, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingX: 5, backgroundColor: '#E5F9ED', borderLeft: '6px solid #2ECC71' }}>
          <CardContent>
            <ModeOfTravel sx={{ fontSize: 50, color: '#2ECC71' }} />
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">Travels</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2ECC71' }}>
              {totalTravels}
            </Typography>
          </CardContent>
        </Card>
      </Box>

        {/* Ongoing Travels */}
      <Box>
        <Card sx={{ width: 200, height: 180, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingX: 5, backgroundColor: '#FFF8E1', borderLeft: '6px solid #F39C12' }}>
          <CardContent>
            <AccessTime sx={{ fontSize: 50, color: '#F39C12' }} />
            <Typography variant="h6">Ongoing</Typography>
            <Typography variant="h6">Travels</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#F39C12' }}>
              {ongoingTravels}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Upcoming Travels */}
      <Box>
        <Card sx={{ width: 200, height: 180, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingX: 5, backgroundColor: '#FFDFDF', borderLeft: '6px solid #FF0000' }}>
          <CardContent>
            <AirplaneTicket sx={{ fontSize: 50, color: '#FF0000' }} />
            <Typography variant="h6">Upcoming</Typography>
            <Typography variant="h6">Travels</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF0000' }}>
              {upcomingTravels}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Finished Travels */}
      <Box>
        <Card sx={{ width: 200, height: 180, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingX: 5, backgroundColor: '#F2EAF6', borderLeft: '6px solid #9B59B6' }}>
          <CardContent>
            <Tour sx={{ fontSize: 50, color: '#9B59B6' }} />
            <Typography variant="h6">Completed</Typography>
            <Typography variant="h6">Travels</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#9B59B6' }}>
              {finishedTravels}
            </Typography>
          </CardContent>
        </Card>
      </Box>

    
    </div>
    </>
  );
};

export default Overview;