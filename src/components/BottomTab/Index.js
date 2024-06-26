import React, { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper, styled } from '@mui/material';
import home from '../../assets/images/hom.svg';
import dashboard from '../../assets/images/dash.svg';
import people from '../../assets/images/people.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  '& .Mui-selected': {
    color: '#FF3F25', // Couleur de l'élément actif
  },
  '& .MuiBottomNavigationAction-root': {
    minWidth: 0, // Pour s'assurer que les éléments ont la même largeur
    maxWidth: '100%',
    flex: 1, // Pour s'assurer que les éléments prennent toute la largeur disponible
  },
}));

const BottomTab = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const icons = [
    { src: "solar:home-smile-angle-linear" , label: 'Dashboard', path: '/dashboard' },
    { src: "solar:users-group-two-rounded-broken", label: 'Employes', path: '/employes' },
    { src: "solar:pen-new-square-outline", label: 'Conges', path: '/conges' },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = icons.findIndex(icon => icon.path === currentPath);
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(icons[newValue].path);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'flex', md: 'none' } }} elevation={2}>
      <StyledBottomNavigation
        showLabels={true}
        value={value}
        onChange={handleChange}
        sx={{ width: '100%', position: 'relative' }}
      >
        {icons.map((icon, index) => (
          <BottomNavigationAction
            key={index}
            label={icon.label}
            icon={
              <Icon 
                icon={icon.src}
                color={value === index ? '#FF3F25' : '#BDBDBD'}
                fontSize={25}
              />
            }
          />
        ))}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: `${(value / icons.length) * 100}%`,
            width: `${100 / icons.length}%`,
            height: '1px',
            backgroundColor: '#FF3F25',
            transition: 'left 0.3s',
          }}
        />
      </StyledBottomNavigation>
    </Paper>
  );
};

export default BottomTab;
