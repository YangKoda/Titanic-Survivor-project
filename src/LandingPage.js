import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from './App';
import logo from './Titanic_Survival_Calculator_Logo.png';

const logoVariants = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, duration: 2 } },
  initial: { y: 0 },
  hover: { y: -10, transition: { type: 'spring', stiffness: 300, duration: 0.3 } }
};

const headingVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, duration: 2, delay: 0.3 } }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, duration: 2, delay: 0.6 } }
};

function LandingPage() {
  const { theme, background } = useTheme();
  const overlayColor = theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: background ? `url('${background}')` : '',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: theme.color,
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: overlayColor,
        zIndex: 1
      }}></div>
      <motion.img
        src={logo}
        alt="Titanic Survival Calculator Logo"
        style={{ maxWidth: '300px', marginBottom: '20px', zIndex: 2 }}
        initial="hidden"
        animate="visible"
        variants={logoVariants}
        whileHover="hover"
      />
      <motion.div style={{ textAlign: 'center', zIndex: 2 }}>
        <motion.div initial="hidden" animate="visible" variants={headingVariants}>
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>Titanic Survival Calculator</Typography>
          <Typography variant="body1" gutterBottom style={{ fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
            Use our tool to predict the survival chances on the Titanic based on various passenger attributes.
          </Typography>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={buttonVariants}>
          <Button
            variant="contained"
            component={Link}
            to="/calculator"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Go to Survival Calculator
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LandingPage;
