import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // For navigation

function Navbar() {
  return (
    <AppBar position="sticky" style={{ backgroundColor: '#3f51b5' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Finder
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/about">About</Button>
        <Button color="inherit" component={Link} to="/contact">Contact</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
