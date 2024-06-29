import { AppBar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography, styled } from '@mui/material';
import user from '../../assets/images/user.svg';
import logo from '../../assets/images/logo.svg';
import hambuger from '../../assets/images/hambuger.svg';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { menuActif } from '../../redux/reducers/rootReducer';
import { Icon } from '@iconify/react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';


const Navbar = () => {
  const location = useLocation();
  const activeLink = useSelector(state => state.betbhr.activeLink)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null);
  const [userSession, setUserSession] = useState('');
  const auth = getAuth();

  const open = Boolean(anchorEl);

  console.log(userSession)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserSession(user);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  async function handleSignOut() {
    await signOut(auth);
    setUserSession('');
    setAnchorEl(null);
}

  useLayoutEffect(() => {
    if (location.pathname === '/dashboard') {
      dispatch(menuActif(0));
    } else if (location.pathname === '/employes') {
      dispatch(menuActif(1));
    } else {
      dispatch(menuActif(2));
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
              <NavLink to="/dashboard" style={{ color: '#101214' }}>
                <img src={logo} alt='logo' />
              </NavLink>
              <Stack direction='row' spacing={2} sx={{ display: { xs: 'none', md: 'flex', } }} >
                <NavLink to="/dashboard" style={{ textDecoration: 'none', color: '#101214' }}>
                  <StyledBoxNav bgcolor={activeLink === 0 ? "#101214" : 'white'} color={activeLink === 0 ? "white" : '#101214'} >
                    <Typography sx={{
                      fontWeight: 400,
                      fontSize: 16
                    }}>
                      Dashboard
                    </Typography>
                  </StyledBoxNav>
                </NavLink>
                <NavLink to="/employes" style={{ textDecoration: 'none', color: '#101214' }}>
                  <StyledBoxNav bgcolor={activeLink === 1 ? "#101214" : 'white'} color={activeLink === 1 ? "white" : '#101214'}>
                    <Typography sx={{
                      fontWeight: 400,
                      fontSize: 16
                    }}>
                      Employés
                    </Typography>
                  </StyledBoxNav>
                </NavLink>
                <NavLink to="/conges" style={{ textDecoration: 'none', color: '#101214' }}>
                  <StyledBoxNav bgcolor={activeLink === 2 ? "#101214" : 'white'} color={activeLink === 2 ? "white" : '#101214'} >
                    <Typography sx={{
                      fontWeight: 400,
                      fontSize: 16
                    }}>
                      Congés
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
                <Icon icon="hugeicons:notification-03" color='#101214' fontSize={20} />
              </IconButton>
            </Stack>
            <Stack direction='row' spacing={2}>
              <IconButton sx={{
                width: 44,
                height: 44,
                borderRadius: '100%',
                backgroundColor: 'white',
              }}
                onClick={handleClick}
              >
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
          <IconButton sx={{ display: { xs: 'flex', md: 'none' }, margin: 0, padding: 0 }} onClick={handleClick}>
            {/* <img src={hambuger} alt='hambuger' width={40} height={40} /> */}
            <img src={user} width={60} height={60} alt='user' />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>
          Notification
        </MenuItem>
        {
          userSession !== "" ? (
            <MenuItem onClick={handleSignOut}>LogOut</MenuItem>
          ) : (
            <NavLink to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              <MenuItem 
                onClick={handleClose}>
                  Login
              </MenuItem>
            </NavLink>
          )
        }

      </Menu>
    </>
  )
}

export default Navbar