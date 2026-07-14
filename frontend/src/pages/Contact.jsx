import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaGraduationCap, FaLaptopCode, FaRocket, FaRobot } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    const [showWave, setShowWave] = useState(false);

    const handleWave = () => {
        setShowWave(true);
        setTimeout(() => setShowWave(false), 2000);
    };

    const handleDownloadCV = () => {
        const link = document.createElement('a');
        link.href = '/nathan_cv.pdf';
        link.download = 'Nathan_Abigail_Rahman_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <main className="contact-page container animate-fade-in">
            <header className="page-header">
                <h1 className="page-title text-gradient">Let's Connect</h1>
                <p className="page-subtitle">I'm actively looking for internship opportunities in Software Engineering.</p>
            </header>

            <div className="contact-content">
                <div className="contact-info">
                    <div className="contact-card glass-card">
                        <button className="easter-egg-btn" onClick={handleWave} aria-label="Say Hi">👋 Hi there!</button>
                        <h3>Contact Information</h3>
                        <p className="contact-desc">Feel free to reach out through any of these platforms.</p>

                        <div className="contact-methods">
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nathanabigailr@gmail.com" target="_blank" rel="noopener noreferrer" className="contact-method-link" title="Send Email via Gmail">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <span>nathanabigailr@gmail.com</span>
                            </a>

                            <a href="https://www.linkedin.com/in/nathan-abigail-r-102090310/" target="_blank" rel="noopener noreferrer" className="contact-method-link">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                <span>LinkedIn</span>
                            </a>

                            <a href="https://github.com/NathanPBJ" target="_blank" rel="noopener noreferrer" className="contact-method-link">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                <span>GitHub</span>
                            </a>
                        </div>

                        <div className="availability-banner">
                            <span className="dot"></span>
                            <span>Actively seeking Internship opportunities</span>
                        </div>
                    </div>
                </div>

                <div className="pitch-container glass-card">
                    <h3>Why Hire Me?</h3>
                    <div className="pitch-content">
                        <div className="pitch-item">
                            <div className="pitch-icon"><FaGraduationCap /></div>
                            <div>
                                <h4>Informatics Student at UPNVJ</h4>
                                <p>Expected to graduate with a strong foundation in Computer Science algorithms, data structures, and software engineering principles.</p>
                            </div>
                        </div>
                        <div className="pitch-item">
                            <div className="pitch-icon"><FaLaptopCode /></div>
                            <div>
                                <h4>Software Engineering Enthusiast</h4>
                                <p>Passionate about building scalable backend microservices and creating seamless user experiences across web and mobile platforms.</p>
                            </div>
                        </div>
                        <div className="pitch-item">
                            <div className="pitch-icon"><FaRocket /></div>
                            <div>
                                <h4>Ready to Contribute</h4>
                                <p>Eager to learn from experienced mentors, adapt to real-world engineering challenges, and deliver high-quality code in a professional team environment.</p>
                            </div>
                        </div>
                        <div className="pitch-item">
                            <div className="pitch-icon"><FaRobot /></div>
                            <div>
                                <h4>AI-Ready Engineer</h4>
                                <p>Embracing the rapid rise of Artificial Intelligence, ready to adapt to new technologies, and utilizing modern AI tools to boost engineering productivity and innovation.</p>
                            </div>
                        </div>
                    </div>

                    <div className="cv-download-section">
                        <button className="btn btn-primary download-btn" onClick={handleDownloadCV}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download Resume / CV
                        </button>
                    </div>
                </div>
            </div>

            {showWave && createPortal(
                <div className="giant-wave-overlay" onClick={() => setShowWave(false)}>
                    <div className="giant-wave-emoji">👋</div>
                </div>,
                document.body
            )}
        </main>
    );
};

export default Contact;
