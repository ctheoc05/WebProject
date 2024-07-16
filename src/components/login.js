// components/login.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('src/pages/api/login.js', { email, password });

      if (response.status === 200) {
        setIsLoggedIn(true);
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data?.message || error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography component="h1" variant="h5" style={{ marginBottom: '20px' }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ marginTop: '10px', marginBottom: '10px', padding: '10px' }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;