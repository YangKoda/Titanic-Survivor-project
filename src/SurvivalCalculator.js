import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Select, MenuItem, FormControl, InputLabel, Button,
  Typography, FormControlLabel, Checkbox, Box, Paper, Tooltip,
  Drawer, List, ListItem, ListItemText, useTheme, Alert
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalculateIcon from '@mui/icons-material/Calculate';
import HistoryIcon from '@mui/icons-material/History';
import { motion } from 'framer-motion';
import { useTheme as useAppTheme } from './App';
import axios from 'axios';

function SurvivalCalculator() {
  const theme = useTheme();
  const { background } = useAppTheme();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [calculatePressed, setCalculatePressed] = useState(false);
  const initialPassengerState = {
    title: '',
    pClass: '',
    sex: '',
    age: '',
    fare: '',
    traveledAlone: false,
    embarked: '',
    mlModel: []
  };
  const [responseData, setResponseData] = useState(null);
  const [passenger, setPassenger] = useState(initialPassengerState);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const firstRender = useRef(true);

  const handleChange = (prop) => async (event) => {
    const value = event.target.value;
    const updatedPassenger = {
      ...passenger,
      [prop]: prop === 'mlModel' ? (typeof value === 'string' ? value.split(',') : value) : value,
    };
    setPassenger(updatedPassenger);
  };

  const handleCheckboxChange = async (event) => {
    const updatedPassenger = { ...passenger, traveledAlone: event.target.checked };
    setPassenger(updatedPassenger);
  };

  const resetForm = () => {
    setPassenger(initialPassengerState);
    setResponseData(null);
    setAlertOpen(false);
    setCalculatePressed(false);
    firstRender.current = true;
  };

  const toggleHistoryDrawer = () => {
    if (!historyOpen) {
      const storedHistory = JSON.parse(localStorage.getItem('responseHistory')) || [];
      setHistory(storedHistory);
    }
    setHistoryOpen(!historyOpen);
  };

  const handleCalculateClick = async () => {

    setCalculatePressed(true);
    setAlertOpen(true);
    await calculateResult(passenger);
  };

  const calculateResult = async (updatedPassenger) => {


    const transformedData = {
      Title: updatedPassenger.title,
      PClass: parseInt(updatedPassenger.pClass, 10),
      Sex: updatedPassenger.sex,
      Age: parseInt(updatedPassenger.age, 10),
      Fare: parseFloat(updatedPassenger.fare),
      TraveledAlone: updatedPassenger.traveledAlone,
      Embarked: updatedPassenger.embarked,
      models: updatedPassenger.mlModel,
    };

    console.log('Transformed data:', transformedData);
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', transformedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response from server:', response.data);
      setResponseData(response.data);

      if (response.data === null || response.data === 'null') {
        setAlertSeverity('error');
        setAlertMessage('Error: Please ensure all fields are filled correctly.');
      }
      else if (passenger.mlModel.length === 0){
        setAlertSeverity('warning');
        setAlertMessage('Please select a model.');
        setAlertOpen(true);
      }
      else {
        setAlertSeverity('success');
        setAlertMessage(JSON.stringify(response.data, null, 2));

        let storedHistory = JSON.parse(localStorage.getItem('responseHistory')) || [];
        storedHistory.unshift(response.data);
        if (storedHistory.length > 5) {
          storedHistory = storedHistory.slice(0, 5);
        }
        localStorage.setItem('responseHistory', JSON.stringify(storedHistory));
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setAlertSeverity('error');
      setAlertMessage('Error: Please ensure all fields are filled correctly.');
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (calculatePressed) {
      calculateResult(passenger);
    }
  }, [passenger]);

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const overlayColor = theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundImage: background ? `url('${background}')` : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: overlayColor,
          zIndex: 1
        }}></div>
        <Paper
          elevation={3}
          sx={{
            padding: '20px',
            width: '80%',
            maxWidth: '500px',
            position: 'relative',
            zIndex: 2
          }}
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, duration: 2 } }
          }}
        >
          <Typography variant="h5" gutterBottom>Survival Calculator</Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel id="title-label">Title</InputLabel>
            <Select
              labelId="title-label"
              value={passenger.title}
              label="Title"
              onChange={handleChange('title')}
            >
              <MenuItem value="Master">Master</MenuItem>
              <MenuItem value="Miss">Miss</MenuItem>
              <MenuItem value="Mr">Mr</MenuItem>
              <MenuItem value="Mrs">Mrs</MenuItem>
              <MenuItem value="Rare">Rare</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="pclass-label">Class</InputLabel>
            <Select
              labelId="pclass-label"
              value={passenger.pClass}
              label="Class"
              onChange={handleChange('pClass')}
            >
              <MenuItem value={1}>First</MenuItem>
              <MenuItem value={2}>Second</MenuItem>
              <MenuItem value={3}>Third</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="sex-label">Sex</InputLabel>
            <Select
              labelId="sex-label"
              value={passenger.sex}
              label="Sex"
              onChange={handleChange('sex')}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Age"
            type="number"
            value={passenger.age}
            onChange={handleChange('age')}
            margin="normal"
            InputProps={{
              inputProps: {
                style: {
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }
              }
            }}
            sx={{
              '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0
              }
            }}
          />

          <TextField
            fullWidth
            label="Fare"
            type="number"
            value={passenger.fare}
            onChange={handleChange('fare')}
            margin="normal"
            InputProps={{
              inputProps: {
                style: {
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }
              }
            }}
            sx={{
              '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              }
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="embarked-label">Embarked</InputLabel>
            <Select
              labelId="embarked-label"
              value={passenger.embarked}
              label="Embarked"
              onChange={handleChange('embarked')}
            >
              <MenuItem value="Cherbourg">Cherbourg</MenuItem>
              <MenuItem value="Queenstown">Queenstown</MenuItem>
              <MenuItem value="Southampton">Southampton</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={passenger.traveledAlone}
                onChange={handleCheckboxChange}
              />
            }
            label="Traveled Alone"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="ml-model-label">Machine Learning Model</InputLabel>
            <Select
              labelId="ml-model-label"
              multiple
              value={passenger.mlModel}
              onChange={handleChange('mlModel')}
              renderValue={(selected) => selected.join(', ')}
            >
              {['Random Forest', 'Decision Tree', 'KNN', 'SVM', 'Logistic Regression'].map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={passenger.mlModel.indexOf(name) > -1} />
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Tooltip title="Calculate" arrow>
              <Button variant="contained" onClick={handleCalculateClick}>
                <CalculateIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Reset" arrow>
              <Button variant="contained" onClick={resetForm} color="error">
                <RefreshIcon />
              </Button>
            </Tooltip>
            <Tooltip title="History" arrow>
              <Button variant="contained" onClick={toggleHistoryDrawer} color="secondary">
                <HistoryIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Back" arrow>
              <Button variant="outlined" onClick={() => navigate(-1)} color="success">
                <ArrowBackOutlinedIcon />
              </Button>
            </Tooltip>
          </Box>

          {alertOpen && (
            <Alert severity={alertSeverity} onClose={handleCloseAlert}>
              {alertMessage}
            </Alert>
          )}

        </Paper>
      </Box>
      <Drawer anchor="bottom" open={historyOpen} onClose={toggleHistoryDrawer}>
        <List>
          {history.map((item, index) => (
            <ListItem button key={index}>
              <ListItemText primary={`History Item ${index + 1}: ${JSON.stringify(item)}`} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </ThemeProvider>
  );
}

export default SurvivalCalculator;
