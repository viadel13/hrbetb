import { Box } from '@mui/material'
import Navbar from '../Navbar/Index'
import { Outlet } from 'react-router-dom'
import BottomTab from '../BottomTab/Index'

const Content = () => {
  return (
    <Box>
      <Navbar />
      <Outlet />
      <BottomTab />
    </Box>
  )
}

export default Content
