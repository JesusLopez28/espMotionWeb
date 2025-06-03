import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { keyframes } from '@emotion/react';

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuIcon?: boolean;
}

// Animación para el pulso del ícono
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// Animación para efecto de brillo en hover
const shimmerAnimation = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showMenuIcon = false }) => {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        color: theme.palette.primary.main
      }}
      elevation={0}
    >
      <Toolbar>
        {showMenuIcon && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Box 
          component={Link} 
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            padding: { xs: '4px 8px', sm: '6px 12px', md: '8px 16px' },
            borderRadius: '12px',
            mr: { xs: 1, sm: 2 },
            textDecoration: 'none',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
              '&::after': {
          opacity: 1,
              }
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              right: '-50%',
              bottom: '-50%',
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
              transform: 'rotate(25deg)',
              backgroundSize: '200% 200%',
              animation: `${shimmerAnimation} 1.5s infinite linear`,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }
          }}
        >
          <FavoriteBorderIcon sx={{ 
            color: 'white', 
            mr: { xs: 0.5, sm: 1 }, 
            fontSize: { xs: 20, sm: 24, md: 28 },
            animation: `${pulseAnimation} 1.5s infinite ease-in-out`,
            zIndex: 1
          }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '0.80rem', sm: '1.1rem', md: '1.2rem' }, // más pequeño en xs
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              zIndex: 1,
              position: 'relative',
              '&::after': {
          content: '""',
          position: 'absolute',
          width: '0%',
          height: '2px',
          bottom: '-2px',
          left: '0',
          backgroundColor: 'white',
          transition: 'width 0.3s ease',
              },
              '&:hover::after': {
          width: '100%',
              }
            }}
          >
            ESP Motion
          </Typography>
        </Box>

        <Typography 
          variant="subtitle1" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: theme.palette.text.primary,
            fontWeight: 500
          }}
        >
          Detector de Emociones
        </Typography>

        <Chip 
          label="IoT Analytics" 
          variant="outlined" 
          size="small" 
          sx={{ 
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            fontWeight: 500,
            mr: 2
          }} 
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
