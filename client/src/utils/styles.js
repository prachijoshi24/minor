import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

const slideIn = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    x: '100%',
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

// Common styled components
export const PageContainer = ({ children, className = '' }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={fadeIn}
    className={`min-h-screen bg-bg p-4 sm:p-6 lg:p-8 ${className}`}
  >
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </motion.div>
);

export const Section = ({ children, title, description, className = '' }) => (
  <section className={`mb-12 ${className}`}>
    {(title || description) && (
      <div className="mb-8 text-center">
        {title && <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>}
        {description && <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>}
      </div>
    )}
    {children}
  </section>
);

export const Card = ({ children, className = '', hoverable = false }) => (
  <motion.div
    className={`bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden ${className}`}
    whileHover={hoverable ? { y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
    transition={{ duration: 0.2, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// Export all animations and variants
export const animations = {
  fadeIn,
  slideIn,
  stagger: {
    container: staggerContainer,
    item: staggerItem
  }
};

// Common style classes
export const styles = {
  // Text
  heading1: 'text-4xl font-bold text-foreground mb-6',
  heading2: 'text-3xl font-semibold text-foreground mb-4',
  heading3: 'text-2xl font-semibold text-foreground mb-3',
  heading4: 'text-xl font-medium text-foreground mb-2',
  paragraph: 'text-base text-foreground/90 mb-4 leading-relaxed',
  
  // Buttons
  button: 'inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50',
  buttonPrimary: 'bg-primary text-white hover:bg-primary-dark',
  buttonSecondary: 'bg-secondary text-white hover:bg-secondary-dark',
  buttonOutline: 'bg-transparent border border-border text-foreground hover:bg-muted',
  buttonGhost: 'bg-transparent text-foreground hover:bg-muted',
  
  // Forms
  input: 'w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-colors',
  label: 'block text-sm font-medium text-foreground/80 mb-1.5',
  
  // Layout
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 md:py-16 lg:py-20',
  
  // Cards
  card: 'bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden',
  cardTitle: 'text-xl font-semibold text-foreground mb-2',
  cardDescription: 'text-muted-foreground mb-4',
  
  // Alerts
  alert: 'p-4 rounded-lg',
  alertSuccess: 'bg-success/10 text-success border border-success/20',
  alertError: 'bg-error/10 text-error border border-error/20',
  alertWarning: 'bg-warning/10 text-warning border border-warning/20',
  alertInfo: 'bg-info/10 text-info border border-info/20'
};

// Animation components
export const AnimateInView = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: delay * 0.1,
        ease: [0.16, 1, 0.3, 1] 
      } 
    }}
    viewport={{ once: true, margin: '-100px 0px' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, className = '' }) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-100px 0px' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '', delay = 0 }) => (
  <motion.div 
    variants={{
      ...staggerItem,
      show: { 
        ...staggerItem.show,
        transition: {
          ...staggerItem.show.transition,
          delay: delay * 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default {
  animations,
  styles,
  PageContainer,
  Section,
  Card,
  AnimateInView,
  StaggerContainer,
  StaggerItem
};
