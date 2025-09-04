import React, { useEffect, useState } from "react";
import {
    Box, Typography, TextField, Button, Chip, IconButton,
    Popover, Grid, Paper
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function JournalEntry() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [entry, setEntry] = useState({
        id: Date.now(),
        title: "",
        content: "",
        tags: [],
        emoji: "📝",
    });
    const [editingTag, setEditingTag] = useState(null);
    const [editingTagValue, setEditingTagValue] = useState("");
    const [emojiAnchor, setEmojiAnchor] = useState(null);
    const [prompt, setPrompt] = useState("");

    // Available emojis for selection
    const availableEmojis = [
        '📝', '✍️', '📖', '📚', '🌟', '✨', '💫', '🪐', '🌙', '☀️', 
        '🌈', '🎨', '💭', '🔮', '🎭', '🎪', '🖋️', '📋', '🗒️', '💝',
        '🎯', '🚀', '⭐', '🌠', '🎊', '🎉', '💎', '🔮', '🎨', '🖼️'
    ];

    // Load entry from localStorage and check for prompts
    useEffect(() => {
        if (id !== "new") {
            const stored = JSON.parse(localStorage.getItem("journalEntries")) || [];
            const existing = stored.find((e) => String(e.id) === id);
            if (existing) setEntry(existing);
        } else {
            // Check for prompt in URL parameters
            const urlParams = new URLSearchParams(location.search);
            const promptParam = urlParams.get('prompt');
            if (promptParam) {
                setPrompt(decodeURIComponent(promptParam));
            }
        }
    }, [id, location.search]);

    // Save entry to localStorage
    const handleSave = () => {
        const stored = JSON.parse(localStorage.getItem("journalEntries")) || [];
        const updated = id === "new" 
            ? [...stored, entry]
            : stored.map((e) => (e.id === entry.id ? entry : e));
        
        localStorage.setItem("journalEntries", JSON.stringify(updated));
        navigate("/");
    };

    // Delete entry from localStorage
    const handleDelete = () => {
        const stored = JSON.parse(localStorage.getItem("journalEntries")) || [];
        const updated = stored.filter((e) => e.id !== entry.id);
        localStorage.setItem("journalEntries", JSON.stringify(updated));
        navigate("/");
    };

    // Tag editing functions
    const handleTagEdit = (index) => {
        setEditingTag(index);
        setEditingTagValue(entry.tags[index]);
    };

    const handleTagSave = (index) => {
        if (editingTagValue.trim()) {
            const updatedTags = [...entry.tags];
            updatedTags[index] = editingTagValue.trim();
            setEntry({ ...entry, tags: updatedTags });
        }
        setEditingTag(null);
        setEditingTagValue("");
    };

    const handleTagCancel = () => {
        setEditingTag(null);
        setEditingTagValue("");
    };

    const handleTagKeyPress = (e, index) => {
        if (e.key === 'Enter') {
            handleTagSave(index);
        } else if (e.key === 'Escape') {
            handleTagCancel();
        }
    };

    // Emoji picker functions
    const handleEmojiClick = (event) => {
        setEmojiAnchor(event.currentTarget);
    };

    const handleEmojiClose = () => {
        setEmojiAnchor(null);
    };

    const handleEmojiSelect = (emoji) => {
        setEntry({ ...entry, emoji });
        handleEmojiClose();
    };

    // Common button styles
    const commonButtonStyles = {
        textTransform: 'none',
        borderRadius: '20px'
    };

    // Common styles
    const saveButtonStyle = {
        ...commonButtonStyles,
        backgroundColor: '#484848',
        color: 'white',
        px: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
            backgroundColor: '#484848'
        }
    };

    const textFieldStyle = {
        '& .MuiInput-underline:before': { borderBottom: 'none' },
        '& .MuiInput-underline:after': { borderBottom: 'none' },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' }
    };

    // Common tag styles
    const tagStyles = {
        mr: 1,
        backgroundColor: 'rgba(157, 177, 201, 0.4)',
        color: '#2c2c2c',
        borderRadius: '20px',
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'rgba(139, 163, 192, 0.4)' },
        '& .MuiChip-deleteIcon': { color: '#666' }
    };

    const tagInputStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            backgroundColor: 'rgba(157, 177, 201, 0.6)',
            '& fieldset': { border: 'none' }
        },
        '& .MuiInputBase-input': {
            padding: '4px 12px',
            fontSize: '0.875rem',
            color: '#2c2c2c'
        }
    };

    return (
        <Box sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100vw',
            height: '100vh',
            zIndex: 1,
            backgroundColor: '#f5f5f5',
            paddingTop: '100px'
        }}>
            {/* Navigation Buttons */}

            <Box sx={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'row', gap: 1 }}>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={saveButtonStyle}
                >
                    Save
                </Button>
                {id !== "new" && (
                    <Button
                        variant="outlined"
                        onClick={handleDelete}
                        sx={{
                            ...commonButtonStyles,
                            px: 3,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            borderColor: '#666',
                            color: '#666',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,1)',
                                borderColor: '#555',
                                color: '#555'
                            }
                        }}
                    >
                        Delete
                    </Button>
                )}
            </Box>

            {/* Journal Entry Card */}
            <Box sx={{ 
                width: '90%', 
                maxWidth: '900px', 
                height: 'calc(100vh - 160px)',
                padding: '40px',
                backgroundColor: '#E6F3FF',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                position: 'relative',
                border: '1px solid #e8e0d0',
                '&::before': {
                    content: '"🪐"',
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    fontSize: '24px',
                    opacity: 0.5
                },
                '&::after': {
                    content: '"🌟"',
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    fontSize: '24px',
                    opacity: 0.8
                }
            }}>
                {/* Date Display */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h3" sx={{ 
                        fontWeight: 'bold', 
                        color: '#2c2c2c',
                        mr: 2,
                        fontSize: '2.5rem'
                    }}>
                        {new Date().getDate()}
                    </Typography>
                    <Box>
                        <Typography variant="body2" sx={{ 
                            color: '#666',
                            fontSize: '0.9rem',
                            lineHeight: 1.2
                        }}>
                            {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                            color: '#666',
                            fontSize: '0.9rem'
                        }}>
                            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Box>
                </Box>

                {/* AI Prompt Display */}
                {prompt && (
                    <Paper sx={{ 
                        p: 2, 
                        mb: 2, 
                        backgroundColor: 'rgba(157, 177, 201, 0.1)',
                        border: '1px solid rgba(157, 177, 201, 0.3)',
                        borderRadius: '12px'
                    }}>
                        <Typography variant="body2" sx={{ 
                            color: '#666',
                            mb: 1,
                            fontSize: '0.9rem',
                            fontWeight: 500
                        }}>
                            💭 AI Writing Prompt:
                        </Typography>
                        <Typography variant="body1" sx={{ 
                            color: '#2c2c2c',
                            fontStyle: 'italic'
                        }}>
                            {prompt}
                        </Typography>
                    </Paper>
                )}

                {/* Emoji Picker */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ 
                        color: '#666',
                        mr: 2,
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}>
                        Choose emoji:
                    </Typography>
                    <IconButton
                        onClick={handleEmojiClick}
                        sx={{
                            backgroundColor: 'rgba(157, 177, 201, 0.2)',
                            borderRadius: '12px',
                            p: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(157, 177, 201, 0.3)'
                            }
                        }}
                    >
                        <Typography sx={{ fontSize: '1.5rem' }}>
                            {entry.emoji}
                        </Typography>
                    </IconButton>
                </Box>

                {/* Emoji Picker Popover */}
                <Popover
                    open={Boolean(emojiAnchor)}
                    anchorEl={emojiAnchor}
                    onClose={handleEmojiClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <Box sx={{ p: 2, maxWidth: '300px' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#2c2c2c' }}>
                            Select an emoji
                        </Typography>
                        <Grid container spacing={1}>
                            {availableEmojis.map((emoji, index) => (
                                <Grid item key={index}>
                                    <IconButton
                                        onClick={() => handleEmojiSelect(emoji)}
                                        sx={{
                                            p: 0.5,
                                            '&:hover': {
                                                backgroundColor: 'rgba(157, 177, 201, 0.2)',
                                                borderRadius: '8px'
                                            }
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '1.2rem' }}>
                                            {emoji}
                                        </Typography>
                                    </IconButton>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Popover>

                {/* Title Input */}
                <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Title"
                    value={entry.title}
                    onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                    InputProps={{ 
                        style: { 
                            fontSize: "2rem", 
                            fontWeight: "bold",
                            color: '#2c2c2c'
                        } 
                    }}
                    sx={{ 
                        mb: 2,
                        ...textFieldStyle
                    }}
                />

                {/* Content Input */}
                <TextField
                    fullWidth
                    multiline
                    rows={8}
                    placeholder="Text"
                    value={entry.content}
                    onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                    variant="standard"
                    sx={{ 
                        mb: 3,
                        mt: -2,
                        ...textFieldStyle,
                        '& .MuiInputBase-input': {
                            fontSize: '1.1rem',
                            lineHeight: 1.6,
                            color: '#2c2c2c',
                            padding: 0
                        },
                        '& .MuiInputBase-root': {
                            border: 'none',
                            padding: 0
                        }
                    }}
                />

                {/* Tags and Add Tag Button at Bottom */}
                <Box sx={{ 
                    position: 'absolute', 
                    bottom: '20px', 
                    left: '40px', 
                    right: '40px',
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap'
                }}>
                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {entry.tags.map((tag, i) => (
                            editingTag === i ? (
                                <TextField
                                    key={i}
                                    value={editingTagValue}
                                    onChange={(e) => setEditingTagValue(e.target.value)}
                                    onBlur={() => handleTagSave(i)}
                                    onKeyDown={(e) => handleTagKeyPress(e, i)}
                                    autoFocus
                                    size="small"
                                    sx={tagInputStyles}
                                />
                            ) : (
                                <Chip
                                    key={i}
                                    label={`# ${tag}`}
                                    onClick={() => handleTagEdit(i)}
                                    onDelete={() =>
                                        setEntry({
                                            ...entry,
                                            tags: entry.tags.filter((_, idx) => idx !== i),
                                        })
                                    }
                                    sx={tagStyles}
                                />
                            )
                        ))}
                    </Box>
                    
                    {/* Add Tag Button */}
                    <Button
                        size="small"
                        onClick={() => setEntry({ ...entry, tags: [...entry.tags, "New Tag"] })}
                        sx={{
                            ...commonButtonStyles,
                            color: '#666',
                            fontSize: '0.9rem'
                        }}
                    >
                        + Add Tag
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}