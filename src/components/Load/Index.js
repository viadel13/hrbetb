import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader = () => (
  <Box
    display="flex"
    justifyContent="center"

    height="100vh"

  >
    <CircularProgress sx={{color: '#FF3F25'}} />
  </Box>
);

export default Loader;
