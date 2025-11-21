import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from './Layout';
import { Box, Container } from '@chakra-ui/react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

export const MainLayout = ({ children, maxW = 'container.xl', ...rest }) => {
  return (
    <Layout>
      <Box 
        as={motion.main}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        py={8}
        minH="calc(100vh - 64px)" // Adjust based on your header height
        display="flex"
        flexDirection="column"
        {...rest}
      >
        <Container 
          maxW={maxW} 
          px={{ base: 4, md: 6 }}
          flex={1}
          display="flex"
          flexDirection="column"
        >
          {children}
        </Container>
      </Box>
    </Layout>
  );
};

// Page wrapper component for consistent page layouts
export const PageContainer = ({ 
  children, 
  title, 
  description, 
  maxW = 'container.xl',
  ...rest 
}) => (
  <MainLayout maxW={maxW} {...rest}>
    {(title || description) && (
      <Box mb={8} textAlign="center">
        {title && (
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            {title}
          </motion.h1>
        )}
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        )}
      </Box>
    )}
    <Box className="flex-1 flex flex-col">
      {children}
    </Box>
  </MainLayout>
);

// Section component for consistent section styling
export const Section = ({ 
  children, 
  title, 
  description, 
  className = '',
  containerProps = {},
  ...rest 
}) => (
  <Box 
    as="section" 
    className={`py-12 ${className}`}
    {...rest}
  >
    <Container maxW="container.xl" px={{ base: 4, md: 6 }} {...containerProps}>
      {(title || description) && (
        <Box className="text-center mb-10">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </Box>
      )}
      {children}
    </Container>
  </Box>
);

// Card component for consistent card styling
export const Card = ({ 
  children, 
  className = '', 
  hoverable = false, 
  ...rest 
}) => (
  <motion.div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${hoverable ? 'hover:shadow-md hover:border-gray-300' : ''} ${className}`}
    whileHover={hoverable ? { y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' } : {}}
    {...rest}
  >
    {children}
  </motion.div>
);

// Card components
Card.Header = ({ children, className = '', ...rest }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...rest}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...rest }) => (
  <div className={`p-6 ${className}`} {...rest}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...rest }) => (
  <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`} {...rest}>
    {children}
  </div>
);
