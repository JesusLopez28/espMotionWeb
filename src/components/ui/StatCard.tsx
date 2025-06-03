import React from 'react';
import { Paper, Typography, Box, useTheme, useMediaQuery } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
  animation?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = '#5271ff',
  subtitle,
  animation,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      sx={{
        p: isMobile ? 2 : 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        },
      }}
      elevation={0}
    >
      {/* Decoración de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: isMobile ? '80px' : '120px',
          height: isMobile ? '80px' : '120px',
          borderRadius: '50%',
          backgroundColor: color,
          opacity: 0.05,
          transform: 'translate(30%, -30%)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: isMobile ? '60px' : '80px',
          height: isMobile ? '60px' : '80px',
          borderRadius: '50%',
          backgroundColor: color,
          opacity: 0.05,
          transform: 'translate(-30%, 30%)',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: isMobile ? 2 : 3,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            color: 'white',
            backgroundColor: color,
            borderRadius: '10px',
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: animation,
            boxShadow: `0 3px 10px ${color}50`,
          }}
        >
          {icon}
        </Box>
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            fontSize: isMobile ? '1.25rem' : '2rem',
            color: theme.palette.text.primary,
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            component="div"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: isMobile ? '0.7rem' : '0.75rem',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;
