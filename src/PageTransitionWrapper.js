import { motion } from 'framer-motion';

const PageTransitionWrapper = ({ children, slideDirection = 'left' }) => {
  const pageTransition = slideDirection === 'left' ? {
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: "100vw",
      scale: 0.8
    },
    initial: {
      opacity: 0,
      x: "-100vw",
      scale: 0.8
    }
  } : {
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: "-100vw",
      scale: 0.8
    },
    initial: {
      opacity: 0,
      x: "100vw",
      scale: 0.8
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageTransition}
      transition={{ type: "tween", ease: "anticipate", duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransitionWrapper;
