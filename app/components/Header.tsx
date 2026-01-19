'use client';

import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 'bold',
          color: 'var(--primary-900)',
          mb: 1,
          textAlign:'center'
        }}
      >
        ABN Business Search
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'var(--secondary-500)',
          fontSize: '16px',
          textAlign:'center'
        }}
      >
        Search Australian Business Register Data
      </Typography>
    </Box>
  );
};
export default Header;

