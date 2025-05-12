import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuIcon?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showMenuIcon = false }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
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
        <IconButton component={Link} to="/" edge="start" color="inherit" sx={{ mr: 2 }}>
          <DashboardIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Detector de Emociones
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
