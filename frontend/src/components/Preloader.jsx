import { useState, useEffect } from 'react';
import './Preloader.css';

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isUnmounted, setIsUnmounted] = useState(false);

    useEffect(() => {
        // Smooth progress bar simulation
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 5) + 1; 
            if (currentProgress >= 100) {
                currentProgress = 100;
                setProgress(100);
                clearInterval(interval);
                
                // Trigger curtain slide up animation after a short pause at 100%
                setTimeout(() => {
                    setIsFinished(true);
                    document.body.style.overflow = 'unset'; // Unlock scroll as soon as it slides up
                }, 500);

                // Unmount completely after CSS animation ends
                setTimeout(() => {
                    setIsUnmounted(true);
                }, 1500); // 500ms pause + 1000ms animation
            } else {
                setProgress(currentProgress);
            }
        }, 40);

        // Lock scrolling while preloader is active
        document.body.style.overflow = 'hidden';

        return () => {
            clearInterval(interval);
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (isUnmounted) return null;

    return (
        <div className={`preloader-container ${isFinished ? 'slide-up' : ''}`}>
            <div className="preloader-content">
                <h2 className="preloader-logo text-gradient">C:\Users\Nathan</h2>
            </div>
            <div className="preloader-bar-container">
                <div className="preloader-bar" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default Preloader;
