import React, { useEffect, useState } from "react";
import { Box, Typography, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EntryCard from "../components /EntryCard.jsx";

export default function JournalList() {
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();

    // Load from localStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("journalEntries")) || [];
        console.log('JournalList - stored entries:', stored.length, stored);
        
        // Add mock entries if no entries exist
        if (stored.length === 0) {
            const mockEntries = [
                {
                    id: 1756702800000, // September 1, 2025
                    title: 'New Year Reflections',
                    content: 'Today marks the beginning of a new year, and I find myself filled with both excitement and nervousness about what lies ahead. I spent the morning journaling about my goals for 2025, focusing on personal growth and mindfulness. The quiet moments of reflection reminded me of how important it is to slow down and appreciate the present moment. I\'m grateful for the lessons learned in 2024 and ready to embrace new challenges.',
                    tags: ['new year', 'reflection', 'goals', 'gratitude'],
                    emoji: '🌟',
                    timestamp: 1756702800000
                },
                {
                    id: 1756789200000, // September 2, 2025
                    title: 'Work Stress and Finding Balance',
                    content: 'Had a particularly challenging day at work today. The project deadline is approaching fast, and I felt overwhelmed by all the tasks on my plate. However, I took a 15-minute walk during lunch, which helped clear my mind. I realized that taking breaks isn\'t a luxury but a necessity for maintaining productivity and mental health. Tomorrow I\'ll try to break down the project into smaller, manageable tasks.',
                    tags: ['work', 'stress', 'balance', 'productivity'],
                    emoji: '😰',
                    timestamp: 1756789200000
                },
                {
                    id: 1756875600000, // September 3, 2025
                    title: 'Coffee Shop Creativity',
                    content: 'Spent the afternoon at my favorite coffee shop, working on a creative writing project I\'ve been putting off. There\'s something magical about the ambient noise and the smell of freshly ground coffee that sparks my creativity. I managed to write 500 words today, which felt like a small victory. The barista remembered my usual order, and that small act of recognition made me smile. Sometimes it\'s the little things that make a day special.',
                    tags: ['creativity', 'writing', 'coffee', 'small wins'],
                    emoji: '☕',
                    timestamp: 1756875600000
                },
                {
                    id: 1756962000000, // September 4, 2025
                    title: 'Gratitude and Family Time',
                    content: 'Had dinner with my family tonight, and it reminded me of how much I have to be grateful for. My mom made my favorite dish, and we spent hours talking and laughing together. My younger sister shared her college experiences, and I felt proud of how much she\'s grown. These moments of connection are what life is really about. I want to make more time for family gatherings and meaningful conversations.',
                    tags: ['family', 'gratitude', 'connection', 'love'],
                    emoji: '❤️',
                    timestamp: 1756962000000
                }
            ];
            
            localStorage.setItem("journalEntries", JSON.stringify(mockEntries));
            setEntries(mockEntries);
        } else {
            setEntries(stored);
        }
    }, []);

    // Navigate to create new entry
    const handleAddNew = () => {
        navigate(`/entry/new`);
    };

    return (
        <Box sx={{ 
            width: '100vw', 
            p: 0, 
            m: 0,
            position: 'relative',
            minHeight: '100vh'
        }}>
            <Box
                component="img"
                src="src/assets/4186331.jpg"
                alt="Sample Image"
                sx={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    objectPosition: "center 30%",
                    display: "block",
                    p: 0,
                    m: 0,
                    position: "relative",
                    top: 0,
                    left: 0
                }}
            />

            <Box
                sx={{
                    height: "auto",
                    width: "95vw",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "#484848",
                    textAlign: "left",
                    pl: 3,
                    pt: 2,
                    pb: 0
                }}
            >
                2025
            </Box>

            {/* List of entries */}
            <Box sx={{ p: 2, mt: -1 }}>
                <EntryCard entries={entries} />

                {entries.length === 0 && (
                    <Typography color="text.secondary" align="center" mt={4}>
                        No entries yet. Create your first journal!
                    </Typography>
                )}
            </Box>

            {/* Floating Add Button */}
            <Fab
                sx={{ 
                    position: "fixed", 
                    bottom: 24, 
                    right: 24,
                    backgroundColor: '#484848',
                    '&:hover': { backgroundColor: '#484848' }
                }}
                onClick={handleAddNew}
            >
                <Add sx={{ color: 'white' }} />
            </Fab>
        </Box>
    );
}
