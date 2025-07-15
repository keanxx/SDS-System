import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  Typography, 
  Box, 
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { 
  FlightTakeoff, 
  ModeOfTravel, 
  AirplaneTicket, 
  Tour, 
  AccessTime 
} from '@mui/icons-material';
import axios from 'axios'; // Import axios for API calls
import dayjs from 'dayjs'; // Import dayjs for date handling

const Navigator = () => {
  // State to track selected travel type
  const [selectedType, setSelectedType] = useState('Total Travels');
  
  // State for airplane position - initialize with offscreen position
  const [planePosition, setPlanePosition] = useState({ left: 0, top: -30 });
  
  // States to store travel counts from API
  const [totalTravels, setTotalTravels] = useState(0);
  const [ongoingTravels, setOngoingTravels] = useState(0);
  const [upcomingTravels, setUpcomingTravels] = useState(0);
  const [finishedTravels, setFinishedTravels] = useState(0);
  
  // Refs for radio buttons - used to get their positions
  const totalRef = useRef(null);
  const ongoingRef = useRef(null);
  const upcomingRef = useRef(null);
  const finishedRef = useRef(null);
  
  // Map of refs - connects travel type names to their DOM references
  const buttonRefs = {
    'Total Travels': totalRef,
    'Ongoing Travels': ongoingRef,
    'Upcoming Travels': upcomingRef,
    'Completed Travels': finishedRef
  };

  // Fetch travel data from API when component mounts
  useEffect(() => {
    // Display loading state or add loading indicators if needed
    
    // Make API call to fetch travel data
    axios.get('http://localhost:5000/api/travels')
      .then((res) => {
        const travels = res.data;
        
        // Set total number of travels
        setTotalTravels(travels.length);

        // Get current date for comparison
        const today = dayjs();
        let upcoming = 0;
        let finished = 0;
        let ongoing = 0;

        // Categorize each travel based on dates
        travels.forEach(travel => {
          // Convert API date strings to dayjs objects for comparison
          const dateFrom = dayjs(travel.DatesFrom);
          const dateTo = dayjs(travel.DatesTo);

          // Categorize travel based on date comparisons:
          // 1. If start date is in future -> upcoming
          // 2. If end date is in past -> finished
          // 3. Otherwise (currently active) -> ongoing
          if (dateFrom.isAfter(today, 'day')) {
            upcoming += 1;
          } else if (dateTo.isBefore(today, 'day')) {
            finished += 1;
          } else {
            ongoing += 1;
          }
        });

        // Update state with categorized counts
        setUpcomingTravels(upcoming);
        setFinishedTravels(finished);
        setOngoingTravels(ongoing);
      })
      .catch((err) => {
        // Handle error state
        console.error('Failed to fetch travels:', err);
        // Could set error state here and display error message to user
      });
  }, []); // Empty dependency array means this runs once on component mount

  // Dynamic card configurations using the actual API data
  const cardConfigs = {
    'Total Travels': {
      icon: <ModeOfTravel sx={{ fontSize: 50, color: '#2ECC71' }} />,
      backgroundColor: '#fffff',
      borderColor: '#2ECC71',
      textColor: '#2ECC71',
      count: totalTravels // Using the state from API
    },
    'Ongoing Travels': {
      icon: <AccessTime sx={{ fontSize: 50, color: '#3498DB' }} />,
      backgroundColor: '#fffff',
      borderColor: '#3498DB',
      textColor: '#3498DB',
      count: ongoingTravels // Using the state from API
    },
    'Upcoming Travels': {
      icon: <AirplaneTicket sx={{ fontSize: 50, color: '#FF0000' }} />,
      backgroundColor: '#fffff',
      borderColor: '#FF0000',
      textColor: '#FF0000',
      count: upcomingTravels // Using the state from API
    },
    'Completed Travels': {
      icon: <Tour sx={{ fontSize: 50, color: '#9B59B6' }} />,
      backgroundColor: '#fffff',
      borderColor: '#9B59B6',
      textColor: '#9B59B6',
      count: finishedTravels // Using the state from API
    }
  };

  // Get current card config based on selection
  const currentCard = cardConfigs[selectedType];

  /**
   * Calculate and update plane position when radio selection changes
   */
  const handleRadioChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    
    // Get the selected radio button's position
    const buttonRef = buttonRefs[newType];
    if (buttonRef.current) {
      const container = buttonRef.current.closest('.radio-container');
      const containerRect = container.getBoundingClientRect();
      const rect = buttonRef.current.getBoundingClientRect();
      const radioControl = buttonRef.current.querySelector('.MuiRadio-root');
      const radioRect = radioControl?.getBoundingClientRect();
      
      // Calculate position relative to container
      setPlanePosition({ 
        left: (radioRect ? radioRect.left : rect.left) - containerRect.left + (radioRect ? radioRect.width / 2 : 0) - 12,
        top: (radioRect ? radioRect.top : rect.top) - containerRect.top - 80,
      });
    }
  };

  // Set initial position on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialRef = buttonRefs['Total Travels'];
      if (initialRef.current) {
        const container = initialRef.current.closest('.radio-container');
        const containerRect = container.getBoundingClientRect();
        const rect = initialRef.current.getBoundingClientRect();
        const radioControl = initialRef.current.querySelector('.MuiRadio-root');
        const radioRect = radioControl?.getBoundingClientRect();
        
        setPlanePosition({ 
          left: (radioRect ? radioRect.left : rect.left) - containerRect.left + (radioRect ? radioRect.width / 2 : 0) - 12,
          top: (radioRect ? radioRect.top : rect.top) - containerRect.top - 80,
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex items-center p-5 gap-5'>
      <div>
        <Box>
          <Card sx={{ 
            width: 200, 
            height: 200, 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            paddingX: 0,  
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: currentCard.backgroundColor, 
            border: `4px solid ${currentCard.borderColor}`,
            transition: 'all 0.3s ease-in-out'
          }}>
            <CardContent>
              {currentCard.icon}
              <Typography variant="h6">{selectedType.split(' ')[0]}</Typography>
              <Typography variant="h6">Travels</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: currentCard.textColor }}>
                {currentCard.count}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </div>
         
      <div className="mt-4 relative radio-container">
        {/* Animated Airplane */}
        <div 
          className="absolute"
          style={{
            position: 'absolute',
            left: `${planePosition.left}px`,
            top: `${planePosition.top}px`,
            zIndex: 1000,
            transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          <FlightTakeoff sx={{ 
            fontSize: 50,
            color: '#0f2b66'
          }} />
        </div>
        
        <div className="bg-white p-4 min-h-[200px] flex items-center justify-center rounded shadow relative">
          <hr className='border border-blue-200 my-2'/>
          <FormControl>
            <FormLabel id="travel-type-radio-group-label">Select Travel Type</FormLabel>
            <RadioGroup
              row
              aria-labelledby="travel-type-radio-group-label"
              name="travel-type-radio-buttons-group"
              value={selectedType}
              onChange={handleRadioChange}
            >
              <FormControlLabel 
                ref={totalRef} 
                value="Total Travels" 
                control={<Radio
                  sx={{ 
                    '& .MuiSvgIcon-root': { fontSize: 35 },
                    color: cardConfigs['Ongoing Travels'].borderColor, 
                    '&.Mui-checked': { color: cardConfigs['Total Travels'].borderColor }
                  }} 
                />} 
                label="Total Travels"
              />
              <FormControlLabel 
                ref={ongoingRef} 
                value="Ongoing Travels" 
                control={<Radio 
                  sx={{ 
                    '& .MuiSvgIcon-root': { fontSize: 35 },
                    color: cardConfigs['Ongoing Travels'].borderColor, 
                    '&.Mui-checked': { color: cardConfigs['Ongoing Travels'].borderColor }
                  }}
                />} 
                label="Ongoing Travels"
              />
              <FormControlLabel 
                ref={upcomingRef} 
                value="Upcoming Travels" 
                control={<Radio 
                  sx={{ 
                    '& .MuiSvgIcon-root': { fontSize: 35 },
                    color: cardConfigs['Ongoing Travels'].borderColor, 
                    '&.Mui-checked': { color: cardConfigs['Upcoming Travels'].borderColor }
                  }}
                />} 
                label="Upcoming Travels"
              />
              <FormControlLabel 
                ref={finishedRef} 
                value="Completed Travels" 
                control={<Radio 
                  sx={{ 
                    '& .MuiSvgIcon-root': { fontSize: 35 },
                    color: cardConfigs['Ongoing Travels'].borderColor, 
                    '&.Mui-checked': { color: cardConfigs['Completed Travels'].borderColor }
                  }}
                />} 
                label="Completed Travels"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default Navigator;