import { useState, useEffect } from 'react';
import './Preloader.css';

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isUnmounted, setIsUnmounted] = useState(false);

    useEffect(() => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 5) + 1; 
            if (currentProgress >= 100) {
                currentProgress = 100;
                setProgress(100);
                clearInterval(interval);
                
                setTimeout(() => {
                    setIsFinished(true);
                    document.body.style.overflow = 'unset';
                }, 500);

                setTimeout(() => {
                    setIsUnmounted(true);
                }, 1500);
            } else {
                setProgress(currentProgress);
            }
        }, 40);

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
                <h2 className="preloader-logo text-gradient">C:\Nathan</h2>
            </div>
            <div className="preloader-bar-container">
                <div className="preloader-bar" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default Preloader;
