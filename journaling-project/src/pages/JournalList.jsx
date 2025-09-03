import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Fab,
    Card,
    CardContent,
    Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
        <Box sx={{ width: '100vw'}}>
            {/*make the image fixed size when refactoring the design*/}
            <Box
                component="img"
                src="src/assets/4186331.jpg"
                alt="Sample Image"
                sx={{
                    width: "100%",
                    height: "20vh",
                    objectFit: "cover",
                    mt: -30
                }}
            />

            <Box
                sx={{
                    mx: "auto",
                    height: "10vh",
                    width: "95vw",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "#484848",
                }}
            >
                2025
            </Box>

            {/* List of entries */}
            <Box sx={{   mt: -5, p: 2 }}>
                <EntryCard entries={entries} />

                {entries.length === 0 && (
                    <Typography color="text.secondary" align="center" mt={4}>
                        No entries yet. Create your first journal!
                    </Typography>
                )}
            </Box>

            {/* Floating Add Button */}
            <Fab
                color="primary"
                sx={{ position: "fixed", bottom: 24, right: 24 }}
                onClick={handleAddNew}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}
