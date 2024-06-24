import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

const CardDetalUser = ({icon, text, nbre}) => {
  return (
    <>
      <Box sx={{
        width: '50%',
        height: "140px",
        borderWidth: 2,
        borderColor: "#E6E6E6",
        borderStyle: 'solid',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'flex'

      }}>
        <Stack sx={{ mx: 2, justifyContent: 'center' }}>
          <Box sx={{
            width: '44px',
            height: '44px',
            backgroundColor: '#F9F9F9',
            borderRadius: 999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2
          }}>
            {icon}
          </Box>
          <Typography sx={{ color: '#101214', fontSize: { xs: '15px', sm: '20px' }, fontWeight: 600 }}>{nbre}</Typography>
          <Typography sx={{ color: '#BDBDBD', fontSize: { xs: '12px', sm: '15px' } }}>{text} </Typography>
        </Stack>
      </Box>
    </>
  )
}

export default CardDetalUser
