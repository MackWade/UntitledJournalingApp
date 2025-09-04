import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Typography, IconButton
} from '@mui/material';
import { Close, Menu, SmartToy, MenuBook, CalendarMonth } from '@mui/icons-material';

export default function SideNavBar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setOpen(false);
    };

    const menuItems = [
        { text: 'Journal', icon: <MenuBook />, path: '/' },
        { text: 'Spacey AI', icon: <SmartToy />, path: '/spacey' },
        { text: 'Calendar', icon: <CalendarMonth />, path: '/calendar' },
    ];

    return (
        <Box>
            {/* Menu Button - only show when drawer is closed */}
            {!open && (
                <IconButton
                    onClick={toggleDrawer(true)}
                    sx={{
                        position: 'fixed',
                        top: '20px',
                        left: '20px',
                        zIndex: 1300,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,1)'
                        }
                    }}
                >
                    <Menu />
                </IconButton>
            )}

            {/* Drawer */}
            <Drawer 
                open={open} 
                onClose={toggleDrawer(false)}
                anchor="left"
                sx={{
                    '& .MuiDrawer-paper': {
                        border: 'none',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <Box 
                    sx={{ 
                        width: 280,
                        height: '100%',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        flexDirection: 'column'
                    }} 
                    role="presentation"
                >
                    {/* Header */}
                    <Box sx={{ 
                        p: 3, 
                        backgroundColor: '#ffffff',
                        borderBottom: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        
                            <Typography variant="h6" sx={{ 
                                fontWeight: 'bold',
                                color: '#2c2c2c',
                                fontSize: '1.2rem'
                            }}>
                                Galactic Journal
                            </Typography>
                        </Box>
                        <IconButton 
                            onClick={toggleDrawer(false)}
                            sx={{ 
                                color: '#666',
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Navigation Items */}
                    <Box sx={{ flex: 1, pt: 2 }}>
                        <List>
                            {menuItems.map((item) => (
                                <ListItem key={item.text} disablePadding sx={{ px: 2 }}>
                                    <ListItemButton
                                        onClick={() => handleNavigation(item.path)}
                                        sx={{
                                            borderRadius: '12px',
                                            mb: 1,
                                            backgroundColor: location.pathname === item.path ? '#e3f2fd' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: location.pathname === item.path ? '#e3f2fd' : 'rgba(0,0,0,0.04)'
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ 
                                            minWidth: 40,
                                            color: location.pathname === item.path ? '#1976d2' : '#666'
                                        }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={item.text}
                                            sx={{
                                                '& .MuiListItemText-primary': {
                                                    fontSize: '1rem',
                                                    fontWeight: location.pathname === item.path ? '600' : '400',
                                                    color: location.pathname === item.path ? '#1976d2' : '#2c2c2c'
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                </Box>
            </Drawer>
        </Box>
    );
}