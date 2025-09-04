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
        setEntries(stored);
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
