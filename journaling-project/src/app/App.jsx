import './App.css'
import SideNavBar from "../utils/SideNavBar.jsx";
import HomeView from "../components /HomeView.jsx";
import Box from "@mui/material/Box";
import {Paper, Typography} from "@mui/material";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'light', // or 'dark'
        background: {
            default: '#ADD8E6', // A light blue hex code
        },
    }  });
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
        <ThemeProvider theme={theme}>
            <SideNavBar/>
            <CssBaseline />
            <HomeView/>
        </ThemeProvider>
    </>
  )
}

export default App
