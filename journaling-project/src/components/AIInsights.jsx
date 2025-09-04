import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Grid,
    Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InsightsIcon from '@mui/icons-material/Insights';
import { 
    analyzeSentiment, 
    detectThemes, 
    generateDynamicPrompts, 
    generateWeeklyReflection, 
    generateMonthlyReflection 
} from '../utils/aiAnalysis';

const AIInsights = ({ entries = [] }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [reflection, setReflection] = useState(null);
    const [prompts, setPrompts] = useState([]);
    const [sentimentData, setSentimentData] = useState({ positive: 0, negative: 0, neutral: 0 });
    const [themeData, setThemeData] = useState([]);

    // Generate insights when entries change
    useEffect(() => {
        if (entries.length === 0) return;

        // Generate dynamic prompts
        const dynamicPrompts = generateDynamicPrompts(entries);
        setPrompts(dynamicPrompts);

        // Analyze sentiment distribution
        const sentiments = entries.map(entry => analyzeSentiment(entry.content || ''));
        const sentimentCounts = sentiments.reduce((acc, sentiment) => {
            acc[sentiment] = (acc[sentiment] || 0) + 1;
            return acc;
        }, {});

        setSentimentData({
            positive: sentimentCounts.positive || 0,
            negative: sentimentCounts.negative || 0,
            neutral: sentimentCounts.neutral || 0
        });

        // Analyze themes
        const allThemes = [];
        entries.forEach(entry => {
            const themes = detectThemes(entry.content || '');
            allThemes.push(...themes);
        });

        const themeCounts = allThemes.reduce((acc, theme) => {
            const key = theme.theme;
            acc[key] = (acc[key] || 0) + theme.matches;
            return acc;
        }, {});

        const sortedThemes = Object.entries(themeCounts)
            .map(([theme, count]) => ({ theme, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        setThemeData(sortedThemes);

        // Generate reflection based on selected period
        const reflectionData = selectedPeriod === 'week' 
            ? generateWeeklyReflection(entries)
            : generateMonthlyReflection(entries);
        setReflection(reflectionData);
    }, [entries, selectedPeriod]);

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'positive': return '#4caf50';
            case 'negative': return '#f44336';
            default: return '#9e9e9e';
        }
    };

    const getSentimentIcon = (sentiment) => {
        switch (sentiment) {
            case 'positive': return '😊';
            case 'negative': return '😔';
            default: return '😐';
        }
    };

    const totalSentiments = sentimentData.positive + sentimentData.negative + sentimentData.neutral;

    return (
        <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
            <Typography variant="h4" sx={{ 
                mb: 3, 
                color: '#2c2c2c',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <PsychologyIcon sx={{ color: '#9db1c9' }} />
                AI Insights
            </Typography>

            {/* Period Selection */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                <Button
                    variant={selectedPeriod === 'week' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedPeriod('week')}
                    sx={{
                        backgroundColor: selectedPeriod === 'week' ? '#9db1c9' : 'transparent',
                        color: selectedPeriod === 'week' ? 'white' : '#9db1c9',
                        borderColor: '#9db1c9',
                        '&:hover': {
                            backgroundColor: selectedPeriod === 'week' ? '#9db1c9' : 'rgba(157, 177, 201, 0.1)'
                        }
                    }}
                >
                    Weekly
                </Button>
                <Button
                    variant={selectedPeriod === 'month' ? 'contained' : 'outlined'}
                    onClick={() => setSelectedPeriod('month')}
                    sx={{
                        backgroundColor: selectedPeriod === 'month' ? '#9db1c9' : 'transparent',
                        color: selectedPeriod === 'month' ? 'white' : '#9db1c9',
                        borderColor: '#9db1c9',
                        '&:hover': {
                            backgroundColor: selectedPeriod === 'month' ? '#9db1c9' : 'rgba(157, 177, 201, 0.1)'
                        }
                    }}
                >
                    Monthly
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Sentiment Analysis */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                        height: '100%',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '16px'
                    }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ 
                                mb: 2, 
                                color: '#2c2c2c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <TrendingUpIcon sx={{ color: '#9db1c9' }} />
                                Sentiment Analysis
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        Positive {getSentimentIcon('positive')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        {totalSentiments > 0 ? Math.round((sentimentData.positive / totalSentiments) * 100) : 0}%
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={totalSentiments > 0 ? (sentimentData.positive / totalSentiments) * 100 : 0}
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#4caf50'
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        Neutral {getSentimentIcon('neutral')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        {totalSentiments > 0 ? Math.round((sentimentData.neutral / totalSentiments) * 100) : 0}%
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={totalSentiments > 0 ? (sentimentData.neutral / totalSentiments) * 100 : 0}
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        backgroundColor: 'rgba(158, 158, 158, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#9e9e9e'
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        Negative {getSentimentIcon('negative')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        {totalSentiments > 0 ? Math.round((sentimentData.negative / totalSentiments) * 100) : 0}%
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={totalSentiments > 0 ? (sentimentData.negative / totalSentiments) * 100 : 0}
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#f44336'
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Theme Analysis */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                        height: '100%',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '16px'
                    }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ 
                                mb: 2, 
                                color: '#2c2c2c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <InsightsIcon sx={{ color: '#9db1c9' }} />
                                Recurring Themes
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {themeData.map((theme, index) => (
                                    <Chip
                                        key={index}
                                        label={`${theme.theme} (${theme.count})`}
                                        sx={{
                                            backgroundColor: 'rgba(157, 177, 201, 0.2)',
                                            color: '#2c2c2c',
                                            fontWeight: 500,
                                            '&:hover': {
                                                backgroundColor: 'rgba(157, 177, 201, 0.3)'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>

                            {themeData.length === 0 && (
                                <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                                    No recurring themes detected yet. Keep writing to see patterns emerge!
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Dynamic Prompts */}
                <Grid item xs={12}>
                    <Card sx={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '16px'
                    }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ 
                                mb: 2, 
                                color: '#2c2c2c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                💭 Dynamic Writing Prompts
                            </Typography>
                            
                            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                                Personalized prompts based on your recent entries:
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {prompts.map((prompt, index) => (
                                    <Paper
                                        key={index}
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(157, 177, 201, 0.05)',
                                            border: '1px solid rgba(157, 177, 201, 0.2)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'rgba(157, 177, 201, 0.1)'
                                            }
                                        }}
                                        onClick={() => {
                                            // Navigate to new entry with prompt
                                            window.location.href = `/entry/new?prompt=${encodeURIComponent(prompt)}`;
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ color: '#2c2c2c' }}>
                                            {prompt}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Reflection Summary */}
                {reflection && (
                    <Grid item xs={12}>
                        <Accordion sx={{ 
                            backgroundColor: '#ffffff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '16px !important',
                            '&:before': { display: 'none' }
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: '#9db1c9' }} />}
                                sx={{ 
                                    backgroundColor: 'rgba(157, 177, 201, 0.05)',
                                    borderRadius: '16px 16px 0 0'
                                }}
                            >
                                <Typography variant="h6" sx={{ color: '#2c2c2c' }}>
                                    📊 {selectedPeriod === 'week' ? 'Weekly' : 'Monthly'} Reflection Summary
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 3 }}>
                                <Typography variant="body1" sx={{ mb: 2, color: '#2c2c2c' }}>
                                    {reflection.summary}
                                </Typography>
                                
                                {reflection.insights && reflection.insights.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6" sx={{ mb: 1, color: '#2c2c2c' }}>
                                            Insights:
                                        </Typography>
                                        {reflection.insights.map((insight, index) => (
                                            <Typography 
                                                key={index}
                                                variant="body2" 
                                                sx={{ 
                                                    mb: 1, 
                                                    color: '#666',
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                • {insight}
                                            </Typography>
                                        ))}
                                    </Box>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default AIInsights;
