import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Switch, FormGroup, FormControlLabel, ThemeProvider, createTheme, Button, Pagination, Collapse } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import LandingPage from './LandingPage';
import SurvivalCalculator from './SurvivalCalculator';
import PageTransitionWrapper from './PageTransitionWrapper';
import './App.css';
import sinkingShip1 from './sinking_ship_1.png';
import sinkingShip2 from './sinking_ship_2.png';
import background3 from "./background3.png";
import background4 from "./background4.png";
import background5 from "./background5.png";
import background6 from "./background6.png";
import background7 from "./background7.png";
import background8 from "./background8.png";

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const backgroundImages = {
  none: '',
  sinking_ship_1: sinkingShip1,
  sinking_ship_2: sinkingShip2,
  background3: background3,
  background4: background4,
  background5: background5,
  background6: background6,
  background7: background7,
  background8: background8
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(1);
  const backgrounds = ['none', 'sinking_ship_2', 'sinking_ship_1', "background3", "background4", "background5", "background6", "background7", "background8"];
  const [background, setBackground] = useState(backgrounds[backgroundIndex]);
  const [isLandscape, setIsLandscape] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#fafafa',
        paper: darkMode ? '#333333' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#333333',
      },
      toggleBackground: {
        main: darkMode ? '#424242' : '#80b3ff',
      },
    },
  });

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleBackgroundChange = (event, value) => {
    setBackgroundIndex(value - 1);
    setBackground(backgrounds[value - 1]);
  };

  const changeBackground = () => {
    const nextIndex = (backgroundIndex + 1) % backgrounds.length;
    setBackgroundIndex(nextIndex);
    setBackground(backgrounds[nextIndex]);
  };

  const handleOrientationChange = () => {
    if (window.innerHeight < window.innerWidth && window.innerWidth <= 940) {
      setIsLandscape(true);
    } else {
      setIsLandscape(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleOrientationChange);
    handleOrientationChange();

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ThemeContext.Provider value={{ theme, toggleTheme, background: backgroundImages[background] }}>
          <div className={isLandscape ? 'landscape-mode' : ''}>
            <AppContent
              darkMode={darkMode}
              changeBackground={changeBackground}
              toggleTheme={toggleTheme}
              backgrounds={backgrounds}
              backgroundIndex={backgroundIndex}
              handleBackgroundChange={handleBackgroundChange}
            />
          </div>
          {isLandscape && <div className="landscape-warning">Please rotate your device to portrait mode.</div>}
        </ThemeContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

function AppContent({ darkMode, changeBackground, toggleTheme, backgrounds, backgroundIndex, handleBackgroundChange }) {
  const location = useLocation();
  const isCalculatorPage = location.pathname === '/calculator';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: darkMode ? '#121212' : '#fafafa', color: darkMode ? '#ffffff' : '#333333' }}>
      <div style={{
        position: 'fixed',
        top: 10,
        left: 10,
        zIndex: 1000,
        backgroundColor: darkMode ? '#424242' : '#80b3ff',
        padding: '8px',
        borderRadius: '4px'
      }}>
        <Button variant="contained" onClick={changeBackground}> <WallpaperIcon /></Button>
      </div>
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 1000,
        backgroundColor: darkMode ? '#424242' : '#80b3ff',
        padding: '8px',
        borderRadius: '4px'
      }}>
        <FormGroup row>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={toggleTheme} icon={<LightModeIcon />} checkedIcon={<DarkModeIcon />} />}
            label={darkMode ? 'Dark Mode' : 'Light Mode'}
          />
        </FormGroup>
      </div>
      <Collapse in={!isCalculatorPage}>
        <div style={{
          position: 'fixed',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: darkMode ? '#424242' : '#80b3ff',
          padding: '8px',
          borderRadius: '4px'
        }}>
          <Pagination count={backgrounds.length} page={backgroundIndex + 1} onChange={handleBackgroundChange} />
        </div>
      </Collapse>
      <RouteStructure />
    </div>
  );
}

function RouteStructure() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransitionWrapper slideDirection="right">
            <LandingPage />
          </PageTransitionWrapper>
        } />
        <Route path="/calculator" element={
          <PageTransitionWrapper slideDirection="left">
            <SurvivalCalculator />
          </PageTransitionWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
