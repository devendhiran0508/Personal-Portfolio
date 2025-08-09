import React, { useEffect, useRef } from 'react';

const GeometricNetwork = ({ 
  nodeCount = 50,
  nodeColor = 'rgba(139, 92, 246, 0.6)',
  connectionColor = 'rgba(139, 92, 246, 0.3)',
  maxConnectionDistance = 150,
  nodeSpeed = 0.5,
  nodeSize = { min: 1, max: 4 },
  className = "",
  zIndex = 1
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const nodesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize nodes after resize
      initializeNodes();
    };
    
    const initializeNodes = () => {
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * nodeSpeed,
        vy: (Math.random() - 0.5) * nodeSpeed,
        radius: Math.random() * (nodeSize.max - nodeSize.min) + nodeSize.min
      }));
    };
    
    const updateNodes = () => {
      nodesRef.current.forEach(node => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(canvas.height, node.y));
        }
      });
    };
    
    const drawNodes = () => {
      nodesRef.current.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      });
    };
    
    const drawConnections = () => {
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeA = nodesRef.current[i];
          const nodeB = nodesRef.current[j];
          
          const distance = Math.sqrt(
            (nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2
          );
          
          if (distance < maxConnectionDistance) {
            const opacity = (1 - distance / maxConnectionDistance) * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = connectionColor.replace(/[\d\.]+\)$/g, `${opacity})`);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      updateNodes();
      drawConnections();
      drawNodes();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodeCount, nodeColor, connectionColor, maxConnectionDistance, nodeSpeed, nodeSize]);

  return (
    <canvas 
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default GeometricNetwork;