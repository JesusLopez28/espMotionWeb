import React from 'react';
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsightsIcon from '@mui/icons-material/Insights';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { keyframes } from '@emotion/react';

const drawerWidth = 240;

// Animación para hover
const glowAnimation = keyframes`
  0% { box-shadow: 0 0 0 rgba(82, 113, 255, 0); }
  50% { box-shadow: 0 0 10px rgba(82, 113, 255, 0.3); }
  100% { box-shadow: 0 0 0 rgba(82, 113, 255, 0); }
`;

// Animación de latido
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

interface SidebarProps {
  onItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Función para verificar la ruta activa
  const isActive = (path: string) => location.pathname === path;

  // Función para manejar el clic en elementos del menú en dispositivos móviles
  const handleItemClick = () => {
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'block', md: 'block' },
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '1px 0 10px rgba(0,0,0,0.05)',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          p: 2,
          pt: 4,
        }}
      >
        <Box sx={{ mb: 3, px: 1 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 600, letterSpacing: 1.2 }}
          >
            ANÁLISIS
          </Typography>
        </Box>

        <List
          sx={{
            '& .MuiListItemButton-root': {
              mb: 1.5,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, rgba(82, 113, 255, 0) 0%, rgba(82, 113, 255, 0.1) 50%, rgba(82, 113, 255, 0) 100%)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.6s ease',
              },
              '&:hover': {
                backgroundColor: 'rgba(82, 113, 255, 0.08)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                animation: `${glowAnimation} 2s infinite ease-in-out`,
                '&::before': {
                  transform: 'translateX(100%)',
                },
              },
            },
            '& .MuiListItemIcon-root': {
              minWidth: 40,
            },
          }}
        >
          <ListItemButton
            component={Link}
            to="/"
            onClick={handleItemClick}
            sx={{
              backgroundColor: isActive('/') ? 'rgba(82, 113, 255, 0.1)' : 'transparent',
              '& .MuiListItemText-primary': {
                color: isActive('/') ? theme.palette.primary.main : theme.palette.text.primary,
                fontWeight: isActive('/') ? 600 : 400,
                transition: 'transform 0.2s ease',
              },
              '& .MuiListItemIcon-root': {
                color: isActive('/') ? theme.palette.primary.main : theme.palette.text.secondary,
                transition: 'transform 0.2s ease',
              },
              '&:hover .MuiListItemText-primary, &:hover .MuiListItemIcon-root': {
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/historical"
            onClick={handleItemClick}
            sx={{
              backgroundColor: isActive('/historical') ? 'rgba(82, 113, 255, 0.1)' : 'transparent',
              '& .MuiListItemText-primary': {
                color: isActive('/historical')
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                fontWeight: isActive('/historical') ? 600 : 400,
                transition: 'transform 0.2s ease',
              },
              '& .MuiListItemIcon-root': {
                color: isActive('/historical')
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                transition: 'transform 0.2s ease',
              },
              '&:hover .MuiListItemText-primary, &:hover .MuiListItemIcon-root': {
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary="Histórico" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/records"
            onClick={handleItemClick}
            sx={{
              backgroundColor: isActive('/records') ? 'rgba(82, 113, 255, 0.1)' : 'transparent',
              '& .MuiListItemText-primary': {
                color: isActive('/records')
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                fontWeight: isActive('/records') ? 600 : 400,
                transition: 'transform 0.2s ease',
              },
              '& .MuiListItemIcon-root': {
                color: isActive('/records')
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                transition: 'transform 0.2s ease',
              },
              '&:hover .MuiListItemText-primary, &:hover .MuiListItemIcon-root': {
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon>
              <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary="Registros" />
          </ListItemButton>
        </List>

        <Box sx={{ mt: 3, mb: 1.5, px: 1 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 600, letterSpacing: 1.2 }}
          >
            INTERPRETACIÓN
          </Typography>
        </Box>

        <List
          sx={{
            '& .MuiListItemButton-root': {
              mb: 1.5,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, rgba(82, 113, 255, 0) 0%, rgba(82, 113, 255, 0.1) 50%, rgba(82, 113, 255, 0) 100%)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.6s ease',
              },
              '&:hover': {
                backgroundColor: 'rgba(82, 113, 255, 0.08)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                animation: `${glowAnimation} 2s infinite ease-in-out`,
                '&::before': {
                  transform: 'translateX(100%)',
                },
              },
            },
            '& .MuiListItemIcon-root': {
              minWidth: 40,
            },
          }}
        >
          <ListItemButton
            component={Link}
            to="/analytics"
            onClick={handleItemClick}
            sx={{
              backgroundColor: isActive('/analytics') ? 'rgba(82, 113, 255, 0.1)' : 'transparent',
              '& .MuiListItemText-primary': {
                color: isActive('/analytics')
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                fontWeight: isActive('/analytics') ? 600 : 400,
                transition: 'transform 0.2s ease',
              },
              '& .MuiListItemIcon-root': {
                color: isActive('/analytics')
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                transition: 'transform 0.2s ease',
              },
              '&:hover .MuiListItemText-primary, &:hover .MuiListItemIcon-root': {
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon>
              <InsightsIcon />
            </ListItemIcon>
            <ListItemText primary="Análisis" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/patterns"
            onClick={handleItemClick}
            sx={{
              backgroundColor: isActive('/patterns') ? 'rgba(82, 113, 255, 0.1)' : 'transparent',
              '& .MuiListItemText-primary': {
                color: isActive('/patterns')
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                fontWeight: isActive('/patterns') ? 600 : 400,
                transition: 'transform 0.2s ease',
              },
              '& .MuiListItemIcon-root': {
                color: isActive('/patterns')
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                transition: 'transform 0.2s ease',
              },
              '&:hover .MuiListItemText-primary, &:hover .MuiListItemIcon-root': {
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon>
              <PsychologyIcon />
            </ListItemIcon>
            <ListItemText primary="Patrones" />
          </ListItemButton>
        </List>

        {!isMobile && (
          <Box
            sx={{
              mt: 'auto',
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(82, 113, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(82, 113, 255, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <FavoriteBorderIcon
              sx={{
                color: theme.palette.secondary.main,
                mr: 1,
                animation: `${pulseAnimation} 1.5s infinite ease-in-out`,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Analizando emociones...
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
