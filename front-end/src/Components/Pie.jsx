import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';

const Pie = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/travels') // Adjust the URL to your API endpoint
      .then((response) => {
        const travels = response.data;

        // Define allowed Areas
        const allowedAreas = ['Division', 'Region', 'National', 'Abroad'];

        // Group by allowed Areas
        const areaCount = {};
        travels.forEach((travel) => {
          const area = travel.Area;
          if (allowedAreas.includes(area)) {
            areaCount[area] = (areaCount[area] || 0) + 1;
          }
        });

        // Set colors for each area
        const colors = {
          Division: '#2ECC71',
          Region: '#2E469C',
          National: '#FF0000',
          Abroad: '#F39C12',
        };

        // Convert grouped data into chart format
        const data = allowedAreas.map((area, index) => ({
          id: index,
          value: areaCount[area] || 0,
          label: area,
          color: colors[area],
        }));

        setChartData(data);
      })
      .catch((error) => {
        console.error('Failed to fetch travel data:', error);
      });
  }, []);

  const valueFormatter = (item) => `${item.value} travels`;

  return (
    <div className='bg-white rounded-lg shadow-md h-[400px] items-center flex flex-col justify-center pt-5'>
      <h2 className='text-center text-2xl font-semibold mb-2'>Travel Distribution</h2>

      <PieChart
        series={[
          {
            data: chartData,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            valueFormatter,
            innerRadius: 40,
            outerRadius: 140,
            paddingAngle: 2,
            cornerRadius: 4,
          },
        ]}
        height={300}
        width={400}
        margin={{ top: 10, bottom: 55, left: 10, right: 10 }}
        legend={{
          hidden: false,
          position: { vertical: 'bottom', horizontal: 'center' },
          direction: 'row',
          itemMarkWidth: 15,
          itemMarkHeight: 15,
          markGap: 8,
          itemGap: 15,
        }}
        slotProps={{
          legend: {
            padding: 5,
            labelStyle: {
              fontSize: 14,
              fontWeight: 500,
            },
          },
        }}
      />
    </div>
  );
};

export default Pie;
