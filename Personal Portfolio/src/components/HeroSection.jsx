import { motion } from 'framer-motion'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

const HeroSection = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const rafRef = useRef()
    const lastMouseUpdate = useRef(0)

    // Throttled mouse move handler for better performance
    const handleMouseMove = useCallback((e) => {
        const now = Date.now()
        
        // Throttle to 60fps max
        if (now - lastMouseUpdate.current < 16) return
        
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
        }
        
        rafRef.current = requestAnimationFrame(() => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / 50,
                y: (e.clientY - window.innerHeight / 2) / 50,
            })
            lastMouseUpdate.current = now
        })
    }, [])

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [handleMouseMove])

    // Memoized animation variants to prevent recreation
    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    }), [])

    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 50,
                damping: 20,
                duration: 0.8,
            },
        },
    }), [])

    const letterVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 10,
            },
        },
    }), [])

    // Memoized floating shapes to prevent recreation on every render
    const floatingShapes = useMemo(() => 
        Array.from({ length: 6 }, (_, i) => ({
            id: i,
            size: Math.random() * 60 + 20,
            delay: Math.random() * 4,
            duration: Math.random() * 3 + 4,
            x: Math.random() * 100,
            y: Math.random() * 100,
        }))
    , [])

    // Memoized name letters to prevent recreation
    const nameLetters = useMemo(() => 
        ['D', 'E', 'V', 'E', 'N', 'D', 'H', 'I', 'R', 'A', 'N']
    , [])

    // Memoized particles data
    const particlesData = useMemo(() => 
        Array.from({ length: 8 }, (_, i) => ({
            id: i,
            left: `${20 + (i * 10)}%`,
            top: `${30 + (i % 3) * 20}%`,
            delay: i * 0.5,
        }))
    , [])

    // Memoized transform style for mouse parallax
    const mouseTransform = useMemo(() => ({
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
    }), [mousePosition.x, mousePosition.y])

    // Memoized animation objects for better performance
    const orbAnimations = useMemo(() => ({
        purpleOrb: {
            animate: {
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                x: [0, 50, 0],
                y: [0, -30, 0],
            },
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        violetOrb: {
            animate: {
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
                x: [0, -40, 0],
                y: [0, 40, 0],
            },
            transition: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        indigoOrb: {
            animate: {
                scale: [1, 1.3, 1],
                rotate: [0, -180, -360],
            },
            transition: {
                duration: 12,
                repeat: Infinity,
                ease: "linear"
            }
        }
    }), [])

    return (
        <section 
            className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 relative overflow-hidden bg-gradient-to-b from-purple-900 to-black"
            id="home"
            role="banner"
        >
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 z-0" role="presentation" aria-hidden="true">
                {/* Animated gradient orbs */}
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 will-change-transform"
                    {...orbAnimations.purpleOrb}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-80 h-80 bg-violet-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 will-change-transform"
                    {...orbAnimations.violetOrb}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-2xl opacity-10 will-change-transform"
                    {...orbAnimations.indigoOrb}
                />

                {/* Floating geometric shapes */}
                {floatingShapes.map((shape) => (
                    <motion.div
                        key={shape.id}
                        className="absolute bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-400/20 will-change-transform"
                        style={{
                            width: shape.size,
                            height: shape.size,
                            left: `${shape.x}%`,
                            top: `${shape.y}%`,
                            borderRadius: shape.id % 2 === 0 ? '50%' : '20%',
                        }}
                        animate={{
                            y: [-20, 20, -20],
                            x: [-10, 10, -10],
                            rotate: [0, 180, 360],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: shape.duration,
                            delay: shape.delay,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center z-40 text-center space-y-8 max-w-4xl"
                role="main"
            >
                {/* Animated Name */}
                <motion.div
                    variants={itemVariants}
                    className="relative will-change-transform"
                    style={mouseTransform}
                >
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-2"
                        initial="hidden"
                        animate="visible"
                        role="heading"
                        aria-level="1"
                    >
                        {nameLetters.map((letter, index) => (
                            <motion.span
                                key={`${letter}-${index}`} // More specific key for React optimization
                                variants={letterVariants}
                                transition={{ delay: index * 0.1 }}
                                className="inline-block bg-gradient-to-r from-white via-purple-200 to-violet-400 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 will-change-transform"
                                whileHover={{ 
                                    scale: 1.2,
                                    rotate: [0, -10, 10, 0],
                                    transition: { duration: 0.3 }
                                }}
                                style={{ 
                                    // Prevent layout shifts during hover
                                    transformOrigin: 'center',
                                    display: 'inline-block',
                                    minWidth: '0.6em' // Ensure consistent spacing
                                }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </motion.h1>

                    {/* Glowing effect behind name */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 blur-2xl -z-10 will-change-transform"
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        aria-hidden="true"
                    />
                </motion.div>

                {/* Enhanced Tags */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap gap-3 justify-center"
                    role="list"
                    aria-label="Professional roles"
                >
                    <motion.span
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-6 py-3 bg-violet-600/20 border border-violet-400/30 rounded-full text-violet-300 text-sm md:text-base font-medium backdrop-blur-sm relative overflow-hidden group will-change-transform"
                        role="listitem"
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/20 to-violet-600/0"
                            animate={{
                                x: [-100, 200],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            aria-hidden="true"
                        />
                        <span className="relative z-10">Aspiring Software Developer</span>
                    </motion.span>
                    <motion.span
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-6 py-3 bg-purple-600/20 border border-purple-400/30 rounded-full text-purple-300 text-sm md:text-base font-medium backdrop-blur-sm relative overflow-hidden group will-change-transform"
                        role="listitem"
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0"
                            animate={{
                                x: [-100, 200],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 1
                            }}
                            aria-hidden="true"
                        />
                        <span className="relative z-10">Full Stack Developer</span>
                    </motion.span>
                </motion.div>

                {/* Enhanced Description */}
                <motion.div
                    variants={itemVariants}
                    className="relative"
                >
                    <motion.p
                        className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed"
                        animate={{
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        role="paragraph"
                        aria-describedby="hero-description"
                    >
                        Passionate about creating innovative web solutions and transforming ideas into digital reality with modern technologies.
                    </motion.p>
                    
                    {/* Animated underline */}
                    <motion.div
                        className="h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent mt-4"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
                        aria-hidden="true"
                    />
                </motion.div>

                {/* Floating particles around content */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    {particlesData.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute w-1 h-1 bg-violet-400 rounded-full will-change-transform"
                            style={{
                                left: particle.left,
                                top: particle.top,
                            }}
                            animate={{
                                y: [-10, -30, -10],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 3,
                                delay: particle.delay,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Enhanced Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40"
                role="button"
                aria-label="Scroll down to continue"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        const nextSection = document.querySelector('#about');
                        nextSection?.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                onClick={() => {
                    const nextSection = document.querySelector('#about');
                    nextSection?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-violet-400 rounded-full flex justify-center relative overflow-hidden cursor-pointer will-change-transform"
                >
                    <motion.div
                        animate={{ y: [0, 16, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 h-3 bg-violet-400 rounded-full mt-2 will-change-transform"
                    />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-400/20 to-transparent will-change-transform"
                        animate={{
                            y: [-20, 20, -20],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            </motion.div>
        </section>
    )
}

export default HeroSection