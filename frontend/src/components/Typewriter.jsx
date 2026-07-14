import { useState, useEffect, useMemo } from 'react';

const Typewriter = ({ text }) => {
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    const variants = useMemo(() => {
        if (!text) return [];
        if (text === "Nathan Abigail Rahman") {
            return [
                "Nathab Abigail Rahman", 
                text
            ];
        }
        return [text + "x", text];
    }, [text]);

    useEffect(() => {
        if (!text || variants.length === 0) return;

        let typingSpeed = isDeleting ? 20 : 60;

        if (!isDeleting && displayText === variants[loopNum]) {
            if (loopNum === variants.length - 1) return;
            
            const timeout = setTimeout(() => setIsDeleting(true), 300);
            return () => clearTimeout(timeout);
        } 
        
        if (isDeleting && displayText === '') {
            const timeout = setTimeout(() => {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }, 0);
            return () => clearTimeout(timeout);
        }

        if (!isDeleting) {
            typingSpeed += Math.random() * 30 - 15; 
        }

        const timeout = setTimeout(() => {
            setDisplayText(
                isDeleting 
                ? variants[loopNum].substring(0, displayText.length - 1)
                : variants[loopNum].substring(0, displayText.length + 1)
            );
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, loopNum, text, variants]);

    return (
        <span className="typewriter-text">
            {displayText}
        </span>
    );
};

export default Typewriter;
