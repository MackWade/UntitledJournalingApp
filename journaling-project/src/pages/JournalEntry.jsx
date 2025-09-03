import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Chip,
    IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function JournalEntry() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [entry, setEntry] = useState({
        id: Date.now(),
        date: new Date().toLocaleString(),
        title: "",
        content: "",
        tags: [],
        images: [],
    });

    // Load entries
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("journalEntries")) || [];
        setEntries(stored);

        if (id !== "new") {
            const existing = stored.find((e) => String(e.id) === id);
            if (existing) setEntry(existing);
        }
    }, [id]);

    // Save entry
    const handleSave = () => {
        let updated;
        if (id === "new") {
            updated = [...entries, entry];
        } else {
            updated = entries.map((e) => (e.id === entry.id ? entry : e));
        }
        localStorage.setItem("journalEntries", JSON.stringify(updated));
        navigate("/");
    };

    // Delete entry
    const handleDelete = () => {
        const updated = entries.filter((e) => e.id !== entry.id);
        localStorage.setItem("journalEntries", JSON.stringify(updated));
        navigate("/");
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map((file) => URL.createObjectURL(file));
        setEntry({ ...entry, images: [...entry.images, ...urls] });
    };

    return (
        <Box sx={{  minHeight: "100vh", p: 3 }}>
            {/* Date */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {entry.date}
            </Typography>

            {/* Title */}
            <TextField
                fullWidth
                variant="standard"
                placeholder="Title..."
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                InputProps={{ style: { fontSize: "1.5rem", fontWeight: "bold" } }}
                sx={{ mb: 2 }}
            />

            {/* Content */}
            <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Write your story..."
                value={entry.content}
                onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                sx={{ mb: 2 }}
            />

            {/* Tags */}
            <Box sx={{ mb: 2 }}>
                {entry.tags.map((tag, i) => (
                    <Chip
                        key={i}
                        label={`#${tag}`}
                        onDelete={() =>
                            setEntry({
                                ...entry,
                                tags: entry.tags.filter((_, idx) => idx !== i),
                            })
                        }
                        sx={{ mr: 1 }}
                    />
                ))}
                <Button
                    size="small"
                    onClick={() =>
                        setEntry({ ...entry, tags: [...entry.tags, "NewTag"] })
                    }
                >
                    + Add Tag
                </Button>
            </Box>

            {/* Images */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                {entry.images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt="attachment"
                        style={{ width: 120, borderRadius: 8 }}
                    />
                ))}
            </Box>
            <Button
                startIcon={<AddPhotoAlternateIcon />}
                component="label"
                variant="outlined"
                sx={{ mb: 3 }}
            >
                Add Image
                <input type="file" hidden multiple onChange={handleImageUpload} />
            </Button>

            {/* Action buttons */}
            <Box display="flex" gap={2}>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                >
                    Save
                </Button>
                {id !== "new" && (
                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                )}
                <IconButton>
                    <TagFacesIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
