// import './App.css'
// import SideNavBar from "../utils/SideNavBar.jsx";
// import HomeView from "../pages/HomeView.jsx";
// import Box from "@mui/material/Box";
// import {Paper, Typography} from "@mui/material";
// import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
//
//
// const theme = createTheme({
//     palette: {
//         mode: 'light', // or 'dark'
//         background: {
//             default: '#ADD8E6', // A light blue hex code
//         },
//     }  });
// function App() {
//   // const [count, setCount] = useState(0)
//
//   return (
//     <>
//         <ThemeProvider theme={theme}>
//             {/*<SideNavBar/>*/}
//             <CssBaseline />
//
//         </ThemeProvider>
//     </>
//   )
// }
//
// export default App
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JournalList from "../pages/JournalList.jsx";
import JournalEntry from "../pages/JournalEntry.jsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'light', // or 'dark'
        background: {
            default: '#d7dff1', // A light blue hex code
        },}  });

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<JournalList/>} />
                    <Route path="/entry/:id" element={<JournalEntry/>} />
                </Routes>
            </Router>
        </ThemeProvider>

    );
}

export default App;
