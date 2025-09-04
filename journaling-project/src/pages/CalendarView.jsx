import React, { useState, useEffect } from 'react';
import {
    Box, Typography, IconButton, Chip, Paper, Grid, Fab,
    Card, CardContent, LinearProgress, Accordion, AccordionSummary,
    AccordionDetails, Button
} from '@mui/material';
import {
    ChevronLeft, ChevronRight, CalendarMonth, ExpandMore,
    TrendingUp, Insights, Lightbulb, LocalFireDepartment,
    Summarize, BarChart
} from '@mui/icons-material';
import { 
    analyzeSentiment, 
    detectThemes, 
    generateDynamicPrompts, 
    generateWeeklyReflection, 
    generateMonthlyReflection 
} from '../utils/AIAnalysis';

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [entries, setEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [reflection, setReflection] = useState(null);
    const [prompts, setPrompts] = useState([]);
    const [sentimentData, setSentimentData] = useState({ positive: 0, negative: 0, neutral: 0 });
    const [themeData, setThemeData] = useState([]);

    // Load entries from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("journalEntries")) || [];
        setEntries(stored);
    }, []);

    // Generate AI insights when entries change
    useEffect(() => {
        if (entries.length === 0) return;

        // Filter entries based on selected period
        const now = new Date();
        let filteredEntries;
        
        if (selectedPeriod === 'week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            filteredEntries = entries.filter(entry => {
                const entryDate = new Date(entry.date || entry.id);
                return entryDate >= weekAgo && entryDate <= now;
            });
        } else { // monthly
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            filteredEntries = entries.filter(entry => {
                const entryDate = new Date(entry.date || entry.id);
                return entryDate >= monthAgo && entryDate <= now;
            });
        }

        // Generate dynamic prompts (use all entries for context)
        const dynamicPrompts = generateDynamicPrompts(entries);
        setPrompts(dynamicPrompts);

        // Analyze sentiment distribution (use filtered entries)
        const sentiments = filteredEntries.map(entry => analyzeSentiment(entry.content || ''));
        const sentimentCounts = sentiments.reduce((acc, sentiment) => {
            acc[sentiment] = (acc[sentiment] || 0) + 1;
            return acc;
        }, {});

        setSentimentData({
            positive: sentimentCounts.positive || 0,
            negative: sentimentCounts.negative || 0,
            neutral: sentimentCounts.neutral || 0
        });

        // Analyze themes (use filtered entries)
        const allThemes = [];
        filteredEntries.forEach(entry => {
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

    // Get entries for a specific date
    const getEntriesForDate = (date) => {
        const dateStr = date.toDateString();
        return entries.filter(entry => {
            const entryDate = new Date(entry.date || entry.id);
            return entryDate.toDateString() === dateStr;
        });
    };

    // Get most popular emoji for a date
    const getMostPopularEmoji = (date, entries = null) => {
        const dayEntries = entries || getEntriesForDate(date);
        if (dayEntries.length === 0) return null;

        const emojiCount = {};
        dayEntries.forEach(entry => {
            const emoji = entry.emoji || '📝';
            emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
        });

        return Object.entries(emojiCount).reduce((a, b) => 
            emojiCount[a[0]] > emojiCount[b[0]] ? a : b
        )[0];
    };

    // Get calendar data
    const getCalendarData = () => {
        if (selectedPeriod === 'week') {
            return getWeeklyCalendarData();
        } else {
            return getMonthlyCalendarData();
        }
    };

    // Get weekly calendar data
    const getWeeklyCalendarData = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start from Sunday
        
        const days = [];
        const current = new Date(startOfWeek);

        // Get date range for filtering (last 7 days)
        const startFilterDate = new Date(now);
        startFilterDate.setDate(now.getDate() - 7);
        const endFilterDate = new Date(now);

        for (let i = 0; i < 7; i++) {
            const dayEntries = getEntriesForDate(current);
            
            // Filter entries based on selected period
            const filteredEntries = dayEntries.filter(entry => {
                const entryDate = new Date(entry.date || entry.id);
                return entryDate >= startFilterDate && entryDate <= endFilterDate;
            });
            
            const mostPopularEmoji = filteredEntries.length > 0 ? getMostPopularEmoji(current, filteredEntries) : null;
            
            days.push({
                date: new Date(current),
                isCurrentMonth: true, // Always show in weekly view
                isToday: current.toDateString() === new Date().toDateString(),
                entries: filteredEntries,
                mostPopularEmoji
            });
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    // Get monthly calendar data
    const getMonthlyCalendarData = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        // Get date range for filtering based on selected period
        const now = new Date();
        let startFilterDate, endFilterDate;
        
        startFilterDate = new Date(now);
        startFilterDate.setMonth(now.getMonth() - 1);
        endFilterDate = new Date(now);

        for (let i = 0; i < 42; i++) {
            const dayEntries = getEntriesForDate(current);
            
            // Filter entries based on selected period
            const filteredEntries = dayEntries.filter(entry => {
                const entryDate = new Date(entry.date || entry.id);
                return entryDate >= startFilterDate && entryDate <= endFilterDate;
            });
            
            const mostPopularEmoji = filteredEntries.length > 0 ? getMostPopularEmoji(current, filteredEntries) : null;
            
            days.push({
                date: new Date(current),
                isCurrentMonth: current.getMonth() === month,
                isToday: current.toDateString() === new Date().toDateString(),
                entries: filteredEntries,
                mostPopularEmoji
            });
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const navigateMonth = (direction) => {
        if (selectedPeriod === 'week') {
            navigateWeek(direction);
        } else {
            navigateMonthOnly(direction);
        }
    };

    const navigateWeek = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + (direction * 7));
            
            // Prevent navigation to future weeks
            const today = new Date();
            const maxWeek = new Date(today);
            maxWeek.setDate(today.getDate() - today.getDay()); // Start of current week
            
            if (newDate > maxWeek) {
                return prev; // Don't navigate if trying to go to future week
            }
            
            return newDate;
        });
    };

    const navigateMonthOnly = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            
            // Prevent navigation to future months
            const today = new Date();
            const maxMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            
            if (newDate > maxMonth) {
                return prev; // Don't navigate if trying to go to future month
            }
            
            return newDate;
        });
    };

    const formatMonthYear = (date) => {
        if (selectedPeriod === 'week') {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            const startStr = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const endStr = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            return `${startStr} - ${endStr}`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            });
        }
    };

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarDays = getCalendarData();
    
    // Check if current period is the maximum allowed
    const today = new Date();
    const isCurrentPeriod = selectedPeriod === 'week' 
        ? (() => {
            const currentWeekStart = new Date(today);
            currentWeekStart.setDate(today.getDate() - today.getDay());
            const viewWeekStart = new Date(currentDate);
            viewWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
            return viewWeekStart.getTime() === currentWeekStart.getTime();
          })()
        : (currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear());

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
        <Box sx={{ 
            minHeight: '100vh',
            width: '100vw',
            backgroundColor: '#d7dff1',
            color: '#2c2c2c',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start'
        }}>
            {/* Header */}
            <Typography variant="h4" sx={{ 
                mb: 4, 
                color: '#2c2c2c',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
            }}>
                <CalendarMonth sx={{ color: '#9db1c9' }} />
                Calendar & AI Insights
            </Typography>

            {/* Period Selection */}
            <Box sx={{ mb: 5, display: 'flex', gap: 1, justifyContent: 'center' }}>
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

            {/* Main Content - 3 Column Layout */}
            <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 2,
                width: '100%',
                alignItems: 'flex-start'
            }}>
                {/* Calendar Section */}
                <Box sx={{ 
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    p: 4,
                    width: '100%',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0',
                    height: 'fit-content',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)'
                }}>
                {/* Month Navigation */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 3
                }}>
                    <IconButton 
                        onClick={() => navigateMonth(-1)}
                        sx={{ 
                            color: '#9db1c9',
                            p: 1
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>
                    
                    <Typography variant="h5" sx={{ 
                        fontWeight: 'bold',
                        color: '#9db1c9',
                        fontSize: '1.5rem'
                    }}>
                        {formatMonthYear(currentDate)}
                    </Typography>
                    
                    <IconButton 
                        onClick={() => navigateMonth(1)}
                        disabled={isCurrentPeriod}
                        sx={{ 
                            color: isCurrentPeriod ? '#ccc' : '#9db1c9',
                            p: 1,
                            '&:disabled': {
                                color: '#ccc'
                            }
                        }}
                    >
                        <ChevronRight />
                    </IconButton>
                </Box>

                {/* Calendar Container */}
                <Box sx={{ width: '100%' }}>
                    {/* Days of Week Header */}
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 0,
                        mb: 2
                    }}>
                        {daysOfWeek.map((day) => (
                            <Box key={day} sx={{ 
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '30px'
                            }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        textAlign: 'center',
                                        color: '#666',
                                        fontWeight: 500,
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {day}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Calendar Grid */}
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: selectedPeriod === 'week' ? 0.5 : 0,
                        gridTemplateRows: selectedPeriod === 'week' ? '1fr' : 'repeat(6, 1fr)',
                        minHeight: selectedPeriod === 'week' ? '100px' : '300px',
                        padding: selectedPeriod === 'week' ? '0 8px' : '0'
                    }}>
                        {calendarDays.map((day, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: day.isCurrentMonth ? 'pointer' : 'default',
                                    py: selectedPeriod === 'week' ? 0.5 : 1,
                                    px: selectedPeriod === 'week' ? 0.25 : 0,
                                    maxWidth: '100%',
                                    '&:hover': day.isCurrentMonth ? {
                                        '& .day-circle': {
                                            backgroundColor: day.isToday ? '#9db1c9' : 'rgba(157, 177, 201, 0.2)'
                                        }
                                    } : {}
                                }}
                                onClick={() => day.isCurrentMonth && setSelectedDate(day)}
                            >
                                {/* Circle with emoji */}
                                <Box
                                    className="day-circle"
                                    sx={{
                                        height: selectedPeriod === 'week' ? '35px' : '40px',
                                        width: selectedPeriod === 'week' ? '35px' : '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        backgroundColor: day.isToday ? '#9db1c9' : 
                                                       day.mostPopularEmoji ? 'transparent' :
                                                       day.isCurrentMonth ? 'rgba(157, 177, 201, 0.1)' : 'transparent',
                                        border: day.mostPopularEmoji ? '2px solid #9db1c9' : 
                                               day.isToday ? 'none' : 'none',
                                        mb: 0.5,
                                        mx: 'auto'
                                    }}
                                >
                                    {day.mostPopularEmoji && (
                                        <Typography sx={{ 
                                            fontSize: selectedPeriod === 'week' ? '1.1rem' : '1.2rem'
                                        }}>
                                            {day.mostPopularEmoji}
                                        </Typography>
                                    )}
                                </Box>
                                
                                {/* Date number below circle */}
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: '#2c2c2c',
                                        fontWeight: day.isToday ? 'bold' : 'normal',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {day.isCurrentMonth ? day.date.getDate() : ''}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Selected Date Info */}
                {selectedDate && (
                    <Box sx={{ 
                        mt: 3, 
                        p: 2, 
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        border: '1px solid #9db1c9'
                    }}>
                        <Typography variant="h6" sx={{ color: '#9db1c9', mb: 1 }}>
                            {selectedDate.date.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </Typography>
                        
                        {selectedDate.entries.length > 0 ? (
                            <Box>
                                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                    {selectedDate.entries.length} entr{selectedDate.entries.length === 1 ? 'y' : 'ies'}
                                </Typography>
                                
                              
                                
                                <Box sx={{ mt: 1 }}>
                                    {selectedDate.entries.map((entry, idx) => (
                                        <Typography 
                                            key={idx}
                                            variant="body2" 
                                            sx={{ 
                                                color: '#666',
                                                fontSize: '0.8rem',
                                                mb: 0.5,
                                                fontWeight: 500
                                            }}
                                        >
                                            {entry.title || 'Untitled'}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                No entries for this day
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Reflection Summary */}
                {reflection && (
                    <Box sx={{ mt: selectedPeriod === 'month' ? -4 : 0 }}>
                        <Accordion sx={{ 
                            backgroundColor: '#ffffff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '16px !important',
                            '&:before': { display: 'none' },
                            width: '100%'
                        }}>
                            <AccordionSummary
                                                                        expandIcon={<ExpandMore sx={{ color: '#9db1c9' }} />}
                                sx={{ 
                                    backgroundColor: 'rgba(157, 177, 201, 0.05)',
                                    borderRadius: '16px 16px 0 0'
                                }}
                            >
                                                                        <Typography variant="h6" sx={{ 
                                            color: '#2c2c2c',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <BarChart sx={{ color: '#9db1c9' }} />
                                            {selectedPeriod === 'week' ? 'Weekly' : 'Monthly'} Summary
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
                    </Box>
                )}
                </Box>

                {/* AI Insights Section - Column 2 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Grid container spacing={2} sx={{ width: '100%', maxWidth: '100%' }}>
                        {/* Sentiment Analysis */}
                        <Grid item xs={12} sx={{ width: '100%' }}>
                            <Card sx={{ 
                                backgroundColor: '#ffffff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '16px',
                                width: '100%',
                                minWidth: '100%',
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ 
                                        mb: 2, 
                                        color: '#2c2c2c',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <TrendingUp sx={{ color: '#9db1c9' }} />
                                        Sentiment
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

                        {/* Dynamic Prompts */}
                        <Grid item xs={12} sx={{ width: '100%' }}>
                            <Card sx={{ 
                                backgroundColor: '#ffffff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '16px',
                                width: '100%',
                                minWidth: '100%',
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ 
                                        mb: 2, 
                                        color: '#2c2c2c',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Lightbulb sx={{ color: '#9db1c9' }} />
                                        Prompts
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                                        Personalized prompts based on your recent entries:
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {prompts.slice(0, 3).map((prompt, index) => (
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


                    </Grid>
                </Box>

                {/* Additional Analytics - Column 3 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Grid container spacing={2} sx={{ width: '100%', maxWidth: '100%' }}>
                        {/* Writing Streak */}
                        <Grid item xs={12} sx={{ width: '100%' }}>
                            <Card sx={{ 
                                backgroundColor: '#ffffff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '16px',
                                width: '100%',
                                minWidth: '100%',
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ 
                                        mb: 2, 
                                        color: '#2c2c2c',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <LocalFireDepartment sx={{ color: '#9db1c9' }} />
                                        Writing Streak
                                    </Typography>
                                    
                                    <Typography variant="h3" sx={{ 
                                        color: '#9db1c9',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        mb: 1
                                    }}>
                                        {reflection?.streak || 0}
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ 
                                        color: '#666',
                                        textAlign: 'center'
                                    }}>
                                        days in a row
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Weekly Digest & Gentle Accountability */}
                        {selectedPeriod === 'week' && (
                            <Grid item xs={12} sx={{ width: '100%' }}>
                                <Card sx={{ 
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)',
                                    width: '100%',
                                minWidth: '100%'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ 
                                            mb: 2, 
                                            color: '#2c2c2c',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <Summarize sx={{ color: '#9db1c9' }} />
                                            Weekly Digest
                                        </Typography>
                                        
                                        <Box sx={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: '12px',
                                            p: 2,
                                            mb: 2
                                        }}>
                                            <Typography variant="body1" sx={{ 
                                                color: '#2c2c2c',
                                                fontStyle: 'italic',
                                                mb: 1
                                            }}>
                                                "You journaled {reflection?.entryCount || 0} times. Your main themes: {themeData.slice(0, 3).map(t => t.theme).join(', ')}. Your mood trended {sentimentData.positive > sentimentData.negative ? 'upward' : sentimentData.negative > sentimentData.positive ? 'downward' : 'steady'} this week."
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ 
                                            backgroundColor: 'rgba(157, 177, 201, 0.1)',
                                            borderRadius: '12px',
                                            p: 2,
                                            border: '1px solid rgba(157, 177, 201, 0.2)'
                                        }}>
                                            <Typography variant="body1" sx={{ 
                                                color: '#2c2c2c',
                                                fontWeight: 500,
                                                textAlign: 'center'
                                            }}>
                                                What would you like to bring into next week?
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {/* Monthly Digest & Gentle Accountability */}
                        {selectedPeriod === 'month' && (
                            <Grid item xs={12} sx={{ width: '100%' }}>
                                <Card sx={{ 
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)',
                                    width: '100%',
                                minWidth: '100%'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ 
                                            mb: 2, 
                                            color: '#2c2c2c',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <BarChart sx={{ color: '#9db1c9' }} />
                                            Monthly Digest
                                        </Typography>
                                        
                                        <Box sx={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: '12px',
                                            p: 2,
                                            mb: 2
                                        }}>
                                            <Typography variant="body1" sx={{ 
                                                color: '#2c2c2c',
                                                fontStyle: 'italic',
                                                mb: 1
                                            }}>
                                                "You journaled {reflection?.entryCount || 0} times this month. Your main themes: {themeData.slice(0, 4).map(t => t.theme).join(', ')}. Your overall mood was {sentimentData.positive > sentimentData.negative ? 'positive' : sentimentData.negative > sentimentData.positive ? 'challenging' : 'balanced'}."
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ 
                                            backgroundColor: 'rgba(157, 177, 201, 0.1)',
                                            borderRadius: '12px',
                                            p: 2,
                                            border: '1px solid rgba(157, 177, 201, 0.2)'
                                        }}>
                                            <Typography variant="body1" sx={{ 
                                                color: '#2c2c2c',
                                                fontWeight: 500,
                                                textAlign: 'center'
                                            }}>
                                                What patterns would you like to continue next month?
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {/* Theme Analysis */}
                        <Grid item xs={12} sx={{ width: '100%' }}>
                            <Card sx={{ 
                                backgroundColor: '#ffffff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '16px',
                                width: '100%',
                                minWidth: '100%',
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ 
                                        mb: 2, 
                                        color: '#2c2c2c',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Insights sx={{ color: '#9db1c9' }} />
                                        Themes
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
                    </Grid>
                </Box>
            </Box>

            {/* Floating Action Button */}
            <Fab
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    backgroundColor: '#484848',
                    '&:hover': { backgroundColor: '#484848' }
                }}
                onClick={() => window.location.href = '/entry/new'}
            >
                <CalendarMonth sx={{ color: 'white' }} />
            </Fab>
        </Box>
    );
};

export default CalendarView;
