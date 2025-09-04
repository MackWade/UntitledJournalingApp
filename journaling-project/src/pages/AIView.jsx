import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent
} from '@mui/material';
import astronautImage from '../assets/astronaut.png';

function AIView() {
    return (
        <Box sx={{ 
            minHeight: '100vh',
            width: '100vw',
            padding: 0,
            margin: 0
        }}>
                {/* Header */}
                <Box sx={{ 
                    mb: 0,
                    p: 2,
                    pt: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c2c2c' }}>
                            Hi, it's Spacey!
                        </Typography>
                        <img 
                            src={astronautImage} 
                            alt="Astronaut" 
                            style={{ 
                                width: '150px', 
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} 
                        />
                    </Box>
                </Box>

                {/* Zapier AI Chatbot */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    px: 2,
                    mb: 2
                }}>
                    <Card sx={{ 
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '800px',
                        backgroundColor: '#9db1c9',
                    }}>
                        <CardContent sx={{ p: 2 }}>
                            <Box sx={{ 
                                borderRadius: '16px',
                                border: '3px solid #9db1c9',
                                overflow: 'hidden',
                            }}>
                                <zapier-interfaces-chatbot-embed 
                                    is-popup='false' 
                                    chatbot-id='cmf4xdu7y000mfczfbpiroxe3' 
                                    height='600px' 
                                    width='100%'
                                ></zapier-interfaces-chatbot-embed>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
                
        </Box>
    );
}

export default AIView;