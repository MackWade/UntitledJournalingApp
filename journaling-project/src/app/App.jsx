import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JournalList from "../pages/JournalList.jsx";
import JournalEntry from "../pages/JournalEntry.jsx";
import AIView from "../pages/AIView.jsx";
import CalendarView from "../pages/CalendarView.jsx";
import SideNavBar from "../utils/SideNavBar.jsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#d7dff1',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <SideNavBar />
                <Routes>
                    <Route path="/" element={<JournalList/>} />
                    <Route path="/spacey" element={<AIView/>} />
                    <Route path="/calendar" element={<CalendarView/>} />
                    <Route path="/entry/:id" element={<JournalEntry/>} />
                </Routes>
            </Router>
        </ThemeProvider>

    );
}

export default App;
