import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';

const Horaire = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours} : ${minutes} : ${seconds}`;
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <Box sx={{
      width: '100%',
      height: 140,
      backgroundColor: '#FF3F25',
      borderRadius: '16px',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex'
    }}>
      <Stack gap={2}>
        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
          {formatTime(currentTime)}
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 500, color: 'white', textAlign: 'center' }}>
          {formatDate(currentTime)}
        </Typography>
      </Stack>
    </Box>
  );
}

export default Horaire;
