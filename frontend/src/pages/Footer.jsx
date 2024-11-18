import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box 
      component="footer"
      sx={{
        backgroundColor: '#3f51b5',
        color: 'white',
        padding: '20px',
        position: 'relative',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="body1">© 2024 Finder. All rights reserved.</Typography>
      <Typography variant="body2">Contact us at info@finder.com</Typography>
    </Box>
  );
}

export default Footer;
