import React from 'react';
import { Box, styled } from '@mui/material';

interface ScrollableContainerProps {
  children: React.ReactNode;
  maxHeight?: string | number;
  height?: string | number;
  width?: string | number;
  padding?: string | number;
}

const StyledScrollableBox = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  overflowX: 'hidden',

  '&::-webkit-scrollbar': {
    width: '6px',
    borderRadius: '6px',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  '&::-webkit-scrollbar-thumb': {
    borderRadius: '6px',
    background: `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },

  '&::-webkit-scrollbar-track': {
    borderRadius: '6px',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },

  '&:hover::-webkit-scrollbar-thumb': {
    background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  maxHeight = '400px',
  height = 'auto',
  width = '100%',
  padding = '0',
}) => {
  return (
    <StyledScrollableBox
      sx={{
        maxHeight,
        height,
        width,
        padding,
      }}
    >
      {children}
    </StyledScrollableBox>
  );
};

export default ScrollableContainer;
