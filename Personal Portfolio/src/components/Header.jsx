import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Github, Linkedin, X, Menu, ExternalLink, Home, User, BookOpen, Code, Phone, FileText, Download, Eye } from "lucide-react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [scrolled, setScrolled] = useState(false);
    const [isManualNavigation, setIsManualNavigation] = useState(false);
    const [showResumeOptions, setShowResumeOptions] = useState(false);
    const scrollTimeoutRef = useRef(null);
    const resumeOptionsRef = useRef(null);
    const ticking = useRef(false);
    const lastScrollY = useRef(0);

    // Memoize navigation items to prevent recreation on every render
    const navItems = useMemo(() => [
        { name: "Home", icon: Home, href: "#home" },
        { name: "About", icon: User, href: "#about" },
        { name: "Education", icon: BookOpen, href: "#education" },
        { name: "Projects", icon: Code, href: "#projects" },
        { name: "Contact", icon: Phone, href: "#contact" }
    ], []);

    // Memoized toggle functions to prevent unnecessary re-renders
    const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
    const toggleResumeOptions = useCallback(() => setShowResumeOptions(prev => !prev), []);

    // Close resume options when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resumeOptionsRef.current && !resumeOptionsRef.current.contains(event.target)) {
                setShowResumeOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Optimized scroll handler with requestAnimationFrame and throttling
    const handleScroll = useCallback(() => {
        if (!ticking.current) {
            requestAnimationFrame(() => {
                // Skip scroll detection during manual navigation
                if (isManualNavigation) {
                    ticking.current = false;
                    return;
                }

                const scrollY = window.scrollY;
                
                // Only update scrolled state if it changes
                const isScrolled = scrollY > 50;
                if (scrolled !== isScrolled) {
                    setScrolled(isScrolled);
                }

                // Only calculate active section if scroll position changed significantly
                if (Math.abs(scrollY - lastScrollY.current) > 10) {
                    const scrollPos = scrollY + 100; // offset for header height
                    let current = "Home"; // fallback section
                    
                    // Cache section elements on first run or when needed
                    const sectionElements = navItems.map(item => document.querySelector(item.href));
                    
                    sectionElements.forEach((el, index) => {
                        if (el && el.offsetTop <= scrollPos) {
                            current = navItems[index].name;
                        }
                    });

                    if (current !== activeSection) {
                        setActiveSection(current);
                    }
                    
                    lastScrollY.current = scrollY;
                }
                
                ticking.current = false;
            });
            
            ticking.current = true;
        }
    }, [isManualNavigation, scrolled, activeSection, navItems]);

    // Passive scroll listener for better performance
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Optimized navigation click handler
    const handleNavClick = useCallback((item) => {
        // Set manual navigation flag to prevent scroll interference
        setIsManualNavigation(true);
        setActiveSection(item.name);
        setIsOpen(false);

        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            const target = document.querySelector(item.href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Re-enable scroll detection after scrolling is complete
        scrollTimeoutRef.current = setTimeout(() => {
            setIsManualNavigation(false);
        }, 1000); // Reduced timeout for better responsiveness
    }, []);

    // Memoized resume handlers
    const handleViewResume = useCallback(() => {
        window.open("/Devendhiran's resume.pdf", "_blank");
    }, []);

    const handleDownloadResume = useCallback(() => {
        const link = document.createElement("a");
        link.href = "/Devendhiran's resume.pdf";
        link.download = "Devendhiran's Resume.pdf"; // Fixed typo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Memoized header classes to prevent recalculation
    const headerClasses = useMemo(() => 
        `fixed w-full z-50 transition-all duration-500 ${
            scrolled 
                ? 'bg-black/80 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
                : 'bg-transparent'
        }`,
        [scrolled]
    );

    // Memoized animation variants for better performance
    const headerVariants = useMemo(() => ({
        initial: { y: -100 },
        animate: { y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    }), []);

    const logoVariants = useMemo(() => ({
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: 0.3, duration: 0.8 }
    }), []);

    const mobileMenuVariants = useMemo(() => ({
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.3 }
    }), []);

    return (
        <>
            <motion.header 
                className={headerClasses}
                {...headerVariants}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20 pt-2">
                        {/* Logo */}
                        <motion.div
                            {...logoVariants}
                            className="flex items-center group cursor-pointer"
                        >
                            <motion.div 
                                className="relative h-24 w-24 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-3"
                                whileHover={{ 
                                    scale: 1.05,
                                    rotate: 5,
                                    boxShadow: "0 10px 30px rgba(147, 51, 234, 0.4)"
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10">
                                    <img 
                                        src="src/assets/logo.webp"
                                        alt="Portfolio Logo"
                                        className="w-24 h-24 object-contain"
                                        // Add loading optimization
                                        loading="eager"
                                        decoding="sync"
                                        // Add explicit dimensions for CLS prevention
                                        width={96}
                                        height={96}
                                    />
                                </span>
                                <motion.div
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100"
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                            <motion.span 
                                className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent dark:from-gray-900 dark:via-gray-700 dark:to-gray-900"
                                whileHover={{ scale: 1.02 }}
                            >
                                Portfolio
                            </motion.span>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center">
                            <div className="flex items-center space-x-2 bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-full px-2 py-2 border border-white/10 dark:border-gray-700/50">
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.name;
                                    
                                    return (
                                        <motion.button
                                            key={item.name}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                                            onClick={() => handleNavClick(item)}
                                            className={`relative px-4 py-2 rounded-full flex items-center space-x-2 font-medium transition-all duration-300 group ${
                                                isActive 
                                                    ? 'text-white' 
                                                    : 'text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-300'
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            // Add explicit type to prevent form submission
                                            type="button"
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                />
                                            )}
                                            <Icon size={16} className="relative z-10" />
                                            <span className="relative z-10">{item.name}</span>
                                            
                                            {!isActive && (
                                                <motion.div
                                                    className="absolute inset-0 bg-white/10 dark:bg-gray-600/20 rounded-full opacity-0 group-hover:opacity-100"
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center space-x-4">
                            {/* Social Icons */}
                            <div className="flex items-center space-x-3">
                                <motion.a
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.0, duration: 0.6 }}
                                    href="https://github.com/devendhiran0508"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/50 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-600/20 transition-all duration-300 group relative"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Visit GitHub profile"
                                >
                                    <Github size={18} />
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100"
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.a>

                                <motion.a
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.1, duration: 0.6 }}
                                    href="https://www.linkedin.com/in/devendhiran-ganapathi/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/50 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-600/20 transition-all duration-300 group relative"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Visit LinkedIn profile"
                                >
                                    <Linkedin size={18} />
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100"
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.a>

                                {/* Resume Button */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.2, duration: 0.6 }}
                                    className="relative"
                                    ref={resumeOptionsRef}
                                >
                                    <motion.button
                                        onClick={toggleResumeOptions}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="button"
                                        aria-label="Resume options"
                                        aria-expanded={showResumeOptions}
                                    >
                                        <FileText size={16} />
                                        <span>Resume</span>
                                    </motion.button>

                                    {/* Resume Options Dropdown */}
                                    <AnimatePresence>
                                        {showResumeOptions && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-12 right-0 mt-2 w-48 bg-white/10 dark:bg-gray-800/90 backdrop-blur-md border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl overflow-hidden z-50"
                                                role="menu"
                                            >
                                                <motion.button
                                                    onClick={handleViewResume}
                                                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 dark:text-gray-200 hover:text-white hover:bg-white/10 dark:hover:bg-gray-600/20 transition-all duration-200"
                                                    whileHover={{ x: 4 }}
                                                    type="button"
                                                    role="menuitem"
                                                >
                                                    <Eye size={16} />
                                                    <span>View Resume</span>
                                                </motion.button>
                                                <motion.button
                                                    onClick={handleDownloadResume}
                                                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 dark:text-gray-200 hover:text-white hover:bg-white/10 dark:hover:bg-gray-600/20 transition-all duration-200 border-t border-white/10 dark:border-gray-700/50"
                                                    whileHover={{ x: 4 }}
                                                    type="button"
                                                    role="menuitem"
                                                >
                                                    <Download size={16} />
                                                    <span>Download Resume</span>
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="lg:hidden p-2 rounded-full bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/50 text-white dark:text-gray-300"
                            onClick={toggleMenu}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                            type="button"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X size={24} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu size={24} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            {...mobileMenuVariants}
                            className="lg:hidden overflow-hidden bg-black/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-white/10 dark:border-gray-700/50"
                        >
                            <div className="px-4 py-6 space-y-4">
                                {/* Mobile Navigation */}
                                <nav className="space-y-2" role="navigation">
                                    {navItems.map((item, index) => {
                                        const Icon = item.icon;
                                        const isActive = activeSection === item.name;
                                        
                                        return (
                                            <motion.button
                                                key={item.name}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1, duration: 0.3 }}
                                                onClick={() => handleNavClick(item)}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                                        : 'text-gray-300 hover:text-white hover:bg-white/10 dark:text-gray-200 dark:hover:bg-gray-600/20'
                                                }`}
                                                whileHover={{ scale: 1.02, x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="button"
                                            >
                                                <Icon size={20} />
                                                <span>{item.name}</span>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="ml-auto w-2 h-2 bg-white rounded-full"
                                                    />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </nav>

                                {/* Mobile Social & Resume */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.3 }}
                                    className="pt-4 border-t border-white/10 dark:border-gray-700/50 space-y-4"
                                >
                                    {/* Resume Button for Mobile */}
                                    <div className="flex flex-col space-y-2">
                                        <motion.button
                                            onClick={handleViewResume}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                        >
                                            <Eye size={18} />
                                            <span>View Resume</span>
                                        </motion.button>
                                        <motion.button
                                            onClick={handleDownloadResume}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white/10 dark:bg-gray-600/20 text-gray-300 dark:text-gray-200 font-medium border border-white/20 dark:border-gray-600/50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                        >
                                            <Download size={18} />
                                            <span>Download Resume</span>
                                        </motion.button>
                                    </div>

                                    {/* Social Icons */}
                                    <div className="flex justify-center space-x-6">
                                        <motion.a
                                            href="https://github.com/devendhiran0508"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 rounded-full bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/50 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-300"
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            aria-label="Visit GitHub profile"
                                        >
                                            <Github size={20} />
                                        </motion.a>

                                        <motion.a
                                            href="https://www.linkedin.com/in/devendhiran-ganapathi/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 rounded-full bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/50 text-gray-300 hover:text-white dark:text-gray-600 dark:hover:text-gray-300"
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                            aria-label="Visit LinkedIn profile"
                                        >
                                            <Linkedin size={20} />
                                        </motion.a>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
};

export default Header;