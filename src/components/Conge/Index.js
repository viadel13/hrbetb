import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

const Conge = () => {

  return (

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#F9F9F9'
      }}
    >

      <Box component='div' sx={{
        flexGrow: 1,
        backgroundColor: "#FFFFFF",
        mx: 2,
        borderRadius: '30px 30px 0 0'
      }}>

        <Outlet />
      </Box>
    </Box>
  )
}

export default Conge
