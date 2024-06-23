import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper, styled } from '@mui/material';
import home from '../../assets/images/hom.svg';
import dashboard from '../../assets/images/dash.svg';
import people from '../../assets/images/people.svg';

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

  const icons = [
    { src: home, label: 'Home' },
    { src: dashboard, label: 'Dashboard' },
    { src: people, label: 'Employes' }
  ];
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { xs: 'flex', md: 'none'} }} elevation={2}>
    <StyledBottomNavigation
      showLabels={true}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{ width: '100%', position: 'relative' }}
    >
      {icons.map((icon, index) => (
        <BottomNavigationAction
          key={index}
          label={icon.label}
          icon={
            <img
              src={icon.src}
              alt={icon.label}
              width={25}
              height={25}
              style={{
                filter: value === index
                  ? 'invert(44%) sepia(82%) saturate(2046%) hue-rotate(334deg) brightness(93%) contrast(96%)'
                  : 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)'
              }}
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
  )
}

export default BottomTab