import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, Stack, Box, Chip } from "@mui/material";
import { AccessTime } from "@mui/icons-material";

const EntryCard = ({ entries, entriesPerPage = 3 }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    // Array of emojis to randomly display
    const emojis = ['📝', '✍️', '📖', '📚', '🌟', '✨', '💫', '🪐', '🌙', '☀️', '🌈', '🎨', '💭', '🔮', '🎭', '🎪', '🎨', '🖋️', '📋', '🗒️'];

    // Function to get a consistent emoji for each entry based on its ID
    const getEntryEmoji = (entryId) => {
        const index = entryId % emojis.length;
        return emojis[index];
    };

    // Calculate total pages
    const totalPages = Math.ceil(entries.length / entriesPerPage);

    // Get entries for current page
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentEntries = entries.slice(startIndex, startIndex + entriesPerPage);

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <>
            {currentEntries.map((entry) => (
                <Card
                    key={entry.id}
                    sx={{
                        mb: 3,
                        cursor: "pointer",
                        minHeight: "140px",
                        borderRadius: "16px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                            borderColor: "#9db1c9"
                        },
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: "linear-gradient(90deg, #9db1c9 0%, #87CEEB 100%)"
                        }
                    }}
                    onClick={() => navigate(`/entry/${entry.id}`)}
                >
                    <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                        {/* Header with date and icon */}
                        <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between",
                            mb: 2
                        }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AccessTime sx={{ color: "#666", fontSize: "1rem" }} />
                                <Typography variant="body2" sx={{ 
                                    color: "#666",
                                    fontWeight: 500,
                                    fontSize: "0.875rem"
                                }}>
                                    {new Date(entry.date || Date.now()).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </Typography>
                            </Box>
                            <Typography sx={{ 
                                fontSize: "1.5rem",
                                lineHeight: 1
                            }}>
                                {entry.emoji || getEntryEmoji(entry.id)}
                            </Typography>
                        </Box>

                        {/* Title */}
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: "bold",
                                color: "#2c2c2c",
                                mb: 1.5,
                                fontSize: "1.25rem",
                                lineHeight: 1.3,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                            }}
                        >
                            {entry.title || "Untitled Entry"}
                        </Typography>

                        {/* Content preview */}
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: "#666",
                                flex: 1,
                                lineHeight: 1.6,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                mb: 2
                            }}
                        >
                            {entry.content || "No content yet..."}
                        </Typography>

                        {/* Tags if available */}
                        {entry.tags && entry.tags.length > 0 && (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: "auto" }}>
                                {entry.tags.slice(0, 3).map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        size="small"
                                        sx={{
                                            backgroundColor: "rgba(157, 177, 201, 0.2)",
                                            color: "#484848",
                                            fontSize: "0.75rem",
                                            height: "20px",
                                            "& .MuiChip-label": {
                                                px: 1
                                            }
                                        }}
                                    />
                                ))}
                                {entry.tags.length > 3 && (
                                    <Chip
                                        label={`+${entry.tags.length - 3}`}
                                        size="small"
                                        sx={{
                                            backgroundColor: "rgba(157, 177, 201, 0.1)",
                                            color: "#666",
                                            fontSize: "0.75rem",
                                            height: "20px",
                                            "& .MuiChip-label": {
                                                px: 1
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))}

            {/* Pagination Controls */}
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                <Button 
                    variant="contained" 
                    onClick={handlePrev} 
                    disabled={currentPage === 1}
                    sx={{
                        backgroundColor: '#484848',
                        '&:hover': { backgroundColor: '#484848' }
                    }}
                >
                    Previous
                </Button>
                <Typography variant="body2" align="center" sx={{ lineHeight: "36px" }}>
                    Page {currentPage} of {totalPages}
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={handleNext} 
                    disabled={currentPage === totalPages}
                    sx={{
                        backgroundColor: '#484848',
                        '&:hover': { backgroundColor: '#484848' }
                    }}
                >
                    Next
                </Button>
            </Stack>
        </>
    );
};

export default EntryCard;
