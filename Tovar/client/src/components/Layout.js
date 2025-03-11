import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Inventory, ShoppingCart, People, Assessment } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Товары', icon: <Inventory />, path: '/products' },
  { text: 'Закупки', icon: <ShoppingCart />, path: '/purchases' },
  { text: 'Поставщики', icon: <People />, path: '/suppliers' },
  { text: 'Отчеты', icon: <Assessment />, path: '/reports' },
];

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Система управления запасами
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 