import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const EntryCard = ({ entries, entriesPerPage = 3 }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

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
                        mb: 2,
                        cursor: "pointer",
                        height: "20vh",
                        borderRadius: 5,
                        backgroundColor: "#9db1c9",
                    }}
                    onClick={() => navigate(`/entry/${entry.id}`)}
                >
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "short",
                            })}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                            {entry.title || "Untitled"}
                        </Typography>
                        <Typography variant="body3" color="text.secondary">
                            {entry.content}
                        </Typography>
                    </CardContent>
                </Card>
            ))}

            {/* Pagination Controls */}
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                <Button variant="contained" onClick={handlePrev} disabled={currentPage === 1}>
                    Previous
                </Button>
                <Typography variant="body2" align="center" sx={{ lineHeight: "36px" }}>
                    Page {currentPage} of {totalPages}
                </Typography>
                <Button variant="contained" onClick={handleNext} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </Stack>
        </>
    );
};

export default EntryCard;
