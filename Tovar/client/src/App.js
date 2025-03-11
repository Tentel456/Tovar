import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout';
import Products from './components/Products';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<Products />} />
            {/* Add more routes here */}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 