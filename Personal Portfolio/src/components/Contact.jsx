import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Linkedin, Send, User, MessageSquare, CheckCircle,
  ArrowRight, Sparkles, Heart, MapPin, Github, Coffee, ArrowUp, Leaf
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Memoize static data to prevent unnecessary re-renders - removed LeetCode
  const socialData = useMemo(() => [
    {
      name: 'Email', icon: Mail, href: 'mailto:devendhiran0508@gmail.com',
      color: 'from-red-500 to-orange-500', hoverColor: 'hover:shadow-red-500/50',
      description: 'Send me an email'
    },
    {
      name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/devendhiran-ganapathi/',
      color: 'from-blue-600 to-blue-700', hoverColor: 'hover:shadow-blue-500/50',
      description: 'Connect on LinkedIn'
    },
    {
      name: 'GitHub', icon: Github, href: 'https://github.com/devendhiran0508',
      color: 'from-gray-700 to-gray-900', hoverColor: 'hover:shadow-gray-500/50',
      description: 'View my repositories'
    }
  ], []);

  const footerLinks = useMemo(() => [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ], []);

  // Memoize animation variants to prevent recreating on each render
  const animationVariants = useMemo(() => ({
    containerVariants: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
      }
    },
    itemVariants: {
      initial: { opacity: 0, y: 60, scale: 0.8 },
      animate: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: "spring", stiffness: 80, damping: 20, duration: 0.8 }
      }
    },
    formVariants: {
      initial: { opacity: 0, x: -100, rotateY: -15 },
      animate: {
        opacity: 1, x: 0, rotateY: 0,
        transition: { type: "spring", stiffness: 60, damping: 15, duration: 1 }
      }
    },
    socialVariants: {
      initial: { opacity: 0, x: 100, rotateY: 15 },
      animate: {
        opacity: 1, x: 0, rotateY: 0,
        transition: { type: "spring", stiffness: 60, damping: 15, duration: 1 }
      }
    },
    socialItemVariants: {
      initial: { opacity: 0, scale: 0, rotate: -180 },
      animate: {
        opacity: 1, scale: 1, rotate: 0,
        transition: { type: "spring", stiffness: 200, damping: 15 }
      }
    },
    inputVariants: {
      focus: {
        scale: 1.02,
        boxShadow: "0 0 25px rgba(139, 92, 246, 0.3)",
        borderColor: "rgba(139, 92, 246, 0.5)",
        transition: { duration: 0.3 }
      }
    },
    buttonVariants: {
      initial: { scale: 1 },
      hover: {
        scale: 1.05,
        boxShadow: "0 15px 35px rgba(139, 92, 246, 0.4)",
        transition: { duration: 0.3 }
      }, 
      tap: { scale: 0.95 }
    }
  }), []);

  // Optimize scroll handler with debouncing
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setShowScrollTop(scrollY > 300);
  }, []);

  useEffect(() => {
    // Use passive listeners for better scroll performance
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setAnimationKey(prev => prev + 1);
        } else {
          setIsInView(false);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start animation slightly before element is visible
      }
    );

    const element = document.getElementById('contact');
    if (element) observer.observe(element);

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll]);

  // Memoize input change handler to prevent unnecessary re-renders
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const res = await fetch('https://personal-portfolio-s8ai.onrender.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);

    } else {
      alert('Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error(error);
    alert('Error sending message.');
  } finally {
    setIsSubmitting(false);
  }
};


  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Updated navigation handler to scroll to contact section
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Handler for email links to scroll to contact form
  const handleEmailClick = useCallback((e) => {
    e.preventDefault();
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus on the form after scrolling
      setTimeout(() => {
        const nameInput = document.querySelector('input[name="name"]');
        if (nameInput) {
          nameInput.focus();
        }
      }, 1000);
    }
  }, []);

  return (
    <div id="contact" className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div
          key={`header-${animationKey}`}
          className="text-center mb-16 md:mb-20"
          variants={animationVariants.containerVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
        >
          <motion.div variants={animationVariants.itemVariants} className="flex items-center justify-center mb-6">
  <motion.div
    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
  >
    <Sparkles className="text-purple-400 mr-3" size={32} />
  </motion.div>
  <motion.h2 
    className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4"
    whileHover={{ 
      scale: 1.05,
      textShadow: "0 0 25px rgba(147, 51, 234, 0.6)",
      transition: { duration: 0.3 }
    }}
  >
    Let's Connect
  </motion.h2>
  <motion.div
    animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
  >
    <Sparkles className="text-blue-400 ml-3" size={32} />
  </motion.div>
</motion.div>
          <motion.p variants={animationVariants.itemVariants} className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Have a project in mind? Let's collaborate and create something amazing together!
          </motion.p>
        </motion.div>

        {/* Main Content with will-change for better animation performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            key={`form-${animationKey}`}
            variants={animationVariants.formVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="relative"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="bg-neutral-900/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-neutral-800 shadow-2xl">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Form inputs with optimized focus handling */}
                    <div className="relative">
                      <motion.div 
                        className="relative" 
                        variants={animationVariants.inputVariants} 
                        animate={focusedField === 'name' ? 'focus' : 'initial'}
                      >
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 z-10" size={20} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Your Name"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
                          autoComplete="name"
                        />
                      </motion.div>
                    </div>
                    
                    <div className="relative">
                      <motion.div 
                        className="relative" 
                        variants={animationVariants.inputVariants} 
                        animate={focusedField === 'email' ? 'focus' : 'initial'}
                      >
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 z-10" size={20} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="your.email@example.com"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
                          autoComplete="email"
                        />
                      </motion.div>
                    </div>
                    
                    <div className="relative">
                      <motion.div 
                        className="relative" 
                        variants={animationVariants.inputVariants} 
                        animate={focusedField === 'subject' ? 'focus' : 'initial'}
                      >
                        <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 z-10" size={20} />
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('subject')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Subject"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
                        />
                      </motion.div>
                    </div>
                    
                    <div className="relative">
                      <motion.div 
                        className="relative" 
                        variants={animationVariants.inputVariants} 
                        animate={focusedField === 'message' ? 'focus' : 'initial'}
                      >
                        <MessageSquare className="absolute left-3 top-4 text-neutral-400 z-10" size={20} />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Tell me about your project..."
                          rows={6}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
                        />
                      </motion.div>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      variants={animationVariants.buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={18} />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-neutral-400">Thank you for reaching out. I'll get back to you soon!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Social Links & Info */}
          <motion.div
            key={`social-${animationKey}`}
            variants={animationVariants.socialVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="space-y-8"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="bg-neutral-900/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-neutral-800 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="text-red-400 mr-3" size={24} />
                </motion.div>
                Get In Touch
              </h3>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                I'm always excited to discuss new projects, creative ideas, or opportunities to be part of your vision. Let's turn your ideas into reality!
              </p>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white mb-4">Connect with me</h4>
                <motion.div
                  className="grid grid-cols-1 gap-4"
                  variants={animationVariants.containerVariants}
                  initial="initial"
                  animate={isInView ? "animate" : "initial"}
                >
                  {socialData.map((social) => {
                    const IconComponent = social.icon;
                    const isEmail = social.name === 'Email';
                    
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target={isEmail ? "_self" : "_blank"}
                        rel={isEmail ? "" : "noopener noreferrer"}
                        onClick={isEmail ? handleEmailClick : undefined}
                        variants={animationVariants.socialItemVariants}
                        whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.3 } }}
                        whileTap={{ scale: 0.95 }}
                        className={`group relative p-4 bg-gradient-to-r ${social.color} rounded-xl shadow-lg hover:shadow-2xl ${social.hoverColor} transition-all duration-300`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                            <IconComponent className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-base">{social.name}</p>
                            <p className="text-white/80 text-sm truncate">{social.description}</p>
                          </div>
                          <ArrowRight
                            className="text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                            size={16}
                          />
                        </div>
                      </motion.a>
                    );
                  })}
                </motion.div>
              </div>
            </div>
            
            <motion.div
              variants={animationVariants.itemVariants}
              className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-purple-500/20"
            >
              <h4 className="text-xl font-bold text-white mb-4">Quick Response</h4>
              <div className="space-y-3 text-neutral-300">
                <motion.p className="flex items-center" whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                  <motion.span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  Usually respond within 24 hours
                </motion.p>
                <motion.p className="flex items-center" whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                  <motion.span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                  />
                  Available for freelance projects
                </motion.p>
                <motion.p className="flex items-center" whileHover={{ x: 5, transition: { duration: 0.2 } }}>
                  <motion.span className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
                  />
                  Open to collaboration opportunities
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Section with optimized rendering */}
        <motion.footer
          className="mt-20 pt-12 border-t border-neutral-800"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <motion.div className="flex items-center group cursor-pointer" whileHover={{ scale: 1.02 }}>
                <motion.div
                  className="relative h-20 w-20 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg mr-3 shadow-lg flex-shrink-0"
                  whileHover={{ scale: 1.05, rotate: 5, boxShadow: "0 10px 30px rgba(147,51,234,0.4)" }}
                >
                  <span className="relative z-10"><img src='/logos/logo.webp'/></span>
                </motion.div>
                <span className="text-lg font-bold text-white">Devendhiran</span>
              </motion.div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Full-Stack Developer passionate about creating innovative solutions and beautiful user experiences. Always eager to learn and collaborate on exciting projects.
              </p>
              <div className="flex items-center space-x-2 text-neutral-400">
                <Leaf size={16} className="flex-shrink-0" />
                <span className="text-sm">Shaped by challenges, strengthened by growth</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <nav className="space-y-2" role="navigation" aria-label="Quick navigation">
                {footerLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    className="block text-neutral-400 hover:text-white transition-colors duration-300 text-sm"
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </nav>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <motion.a
                    href="#contact"
                    onClick={handleEmailClick}
                    className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                    <Mail size={16} />
                  </motion.a>
                  <motion.a href="https://www.linkedin.com/in/devendhiran-ganapathi/" target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                    <Linkedin size={16} />
                  </motion.a>
                  <motion.a href="https://github.com/devendhiran0508" target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                    <Github size={16} />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.div className="text-neutral-400 text-sm text-center md:text-left" whileHover={{ scale: 1.02 }}>
                <p>© {new Date().getFullYear()} Devendhiran Ganapathi. All rights reserved.</p>
                <p className="mt-1">Built with React, Framer Motion, and lots of ☕</p>
              </motion.div>
              <div className="flex items-center space-x-4">
                <motion.p className="text-neutral-500 text-xs" whileHover={{ scale: 1.05, color: "#a855f7" }}>
                  Made with 💜 
                </motion.p>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Back to Top Button with optimized rendering */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl z-50"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;