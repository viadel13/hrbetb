import { Box, Stack, Typography } from '@mui/material'

const Card = ({ icon, name, downName, maxConges }) => {
  return (
    <>
      <>
        <>
          <Box sx={{
            width: '100%',
            height: 108,
            backgroundColor: '#101214',
            borderRadius: '16px',
            justifyContent: 'flex-start',
            alignItems: 'center',
            display: 'flex',
            px: 2
          }}>
            <Stack direction='row' spacing={2}>
              <Box sx={{
                width: '55px',
                height: '55px',
                borderRadius: 999,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex'
              }}>
                {icon}
              </Box>
              <Typography sx={{fontWeight: 'bold', fontSize: '18px', color: maxConges ? name > 25 ? '#FF0000' : 'white' : 'white'}}>
                {name}{maxConges ? ` / ${maxConges}`: ''}
                <Typography sx={{fontWeight: 'bold', fontSize: '14px', color: '#BDBDBD'}}>
                {downName}
              </Typography>
              </Typography>
            </Stack>
          </Box>
        </>
      </>
    </>
  )
}

export default Card
