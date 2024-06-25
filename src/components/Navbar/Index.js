import { AppBar, Box, IconButton, Stack, Toolbar, Typography, styled } from '@mui/material';
import user from '../../assets/images/user.svg';
import logo from '../../assets/images/logo.svg';
import hambuger from '../../assets/images/hambuger.svg';
import { NavLink, useLocation } from 'react-router-dom';
import { useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { menuActif } from '../../redux/reducers/rootReducer';
import { Icon } from '@iconify/react';


const Navbar = () => {
  const location = useLocation();
  const activeLink = useSelector(state => state.betbhr.activeLink)
  const dispatch = useDispatch();


  useLayoutEffect(() => {
    if (location.pathname === '/employes') {
      dispatch(menuActif(true));
    } else {
      dispatch(menuActif(false));
    }
  }, [location.pathname, dispatch]);

  const StyledBoxNav = styled(IconButton)(({ theme, bgcolor, color }) => ({
    backgroundColor: bgcolor,
    width: '120px',
    height: '45px',
    borderRadius: '24px',
    padding: '10px 18px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    color: color,
    '&:hover': {
      backgroundColor: bgcolor,
    },
  }));

  return (
    <>

      <AppBar position='sticky' elevation={0} sx={{ backgroundColor: '#F9F9F9' }}>
        <Toolbar sx={{ backgroundColor: '#F9F9F9', height: 90, mx: 2, display: 'flex', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={10} alignItems="center">
              <NavLink to="/dashboard" style={{  color: '#101214' }}>
                <img src={logo} alt='logo' />
              </NavLink>
              <Stack direction='row' spacing={2} sx={{ display: { xs: 'none', md: 'flex', } }}>
                <NavLink to="/dashboard" style={{ textDecoration: 'none', color: '#101214' }}>
                  <StyledBoxNav bgcolor={!activeLink ? "#101214" : 'white'} color={!activeLink ? "white" : '#101214'} onClick={() => dispatch(menuActif(false))}>
                    <Typography sx={{
                      fontWeight: 400,
                      fontSize: 16
                    }}>
                      Dashboard
                    </Typography>
                  </StyledBoxNav>
                </NavLink>
                <NavLink to="/employes" style={{ textDecoration: 'none', color: '#101214' }}>
                  <StyledBoxNav bgcolor={activeLink ? "#101214" : 'white'} color={activeLink ? "white" : '#101214'} onClick={() => dispatch(menuActif(true))}>
                    <Typography sx={{
                      fontWeight: 400,
                      fontSize: 16
                    }}>
                      Employés
                    </Typography>
                  </StyledBoxNav>
                </NavLink>
              </Stack>

            </Stack>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex', } }} alignItems="center" gap={2} marginLeft={2}>
            <Stack direction='row' spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton sx={{
                width: 44,
                height: 44,
                borderRadius: '100%',
                backgroundColor: 'white'
              }}>

                <Icon icon="ep:search" color='#101214' fontSize={20} />

              </IconButton>
              <IconButton sx={{
                width: 44,
                height: 44,
                borderRadius: '100%',
                backgroundColor: 'white'
              }}>
                <Icon icon="hugeicons:notification-03" color='#101214' fontSize={20} />
              </IconButton>
            </Stack>
            <Stack direction='row' spacing={2}>
              <IconButton sx={{
                width: 44,
                height: 44,
                borderRadius: '100%',
                backgroundColor: 'white'
              }}>
                <img src={user} width={40} height={40} alt='user' />
              </IconButton>
              <Typography
                sx={{
                  color: '#101214',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                BETB SARL
                <Typography
                  sx={{
                    color: '#101214',
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  Administrateur
                </Typography>
              </Typography>
            </Stack>
          </Box>
          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, margin: 0, padding: 0 }}>
            <img src={hambuger} alt='hambuger' width={40} height={40} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar