import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import ProjectCard from '../components/ProjectCard';
import Typewriter from '../components/Typewriter';
import SpotifyWidget from '../components/SpotifyWidget';
import RhinoRun from '../components/RhinoRun';
import { SiGo, SiReact, SiVite, SiJavascript, SiHtml5, SiMysql, SiPython, SiC, SiCplusplus, SiUnity, SiAndroidstudio } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import './Home.css';

const getSkillIcon = (skillName) => {
    switch(skillName) {
        case 'Go': return <SiGo className="skill-icon" />;
        case 'React': return <SiReact className="skill-icon" />;
        case 'Vite': return <SiVite className="skill-icon" />;
        case 'JavaScript': return <SiJavascript className="skill-icon" />;
        case 'HTML/CSS': return <SiHtml5 className="skill-icon" />;
        case 'MySQL': return <SiMysql className="skill-icon" />;
        case 'Python': return <SiPython className="skill-icon" />;
        case 'Java': return <FaJava className="skill-icon" />;
        case 'C': return <SiC className="skill-icon" />;
        case 'C++': return <SiCplusplus className="skill-icon" />;
        case 'Unity': return <SiUnity className="skill-icon" />;
        case 'Android Studio': return <SiAndroidstudio className="skill-icon" />;
        default: return null;
    }
};

const Home = () => {
    const { data: profile } = useFetch('/api/profile');
    const { data: projects, loading: projectsLoading } = useFetch('/api/projects');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        });

        document.querySelectorAll('.section').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const featuredProjects = projects ? projects.filter(p => p.featured).slice(0, 3) : [];

    const [tiltStyle, setTiltStyle] = useState({});

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation degrees (subtle: max 15 degrees)
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;
        
        setTiltStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: 'transform 0.1s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: `perspective(1000px) rotateX(0deg) rotateY(0deg)`,
            transition: 'transform 0.5s ease-out'
        });
    };

    return (
        <main className="home">
            <section className="hero container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Hello, I'm <br />
                        <span className="text-gradient">
                            {profile ? <Typewriter text={profile.name} /> : 'Loading...'}
                        </span>
                    </h1>
                    <h2 className="hero-subtitle">{profile ? profile.title : 'Full-Stack Developer'}</h2>
                    <p className="hero-bio">
                        {profile ? profile.bio : 'Building beautiful and scalable applications.'}
                    </p>
                    <div className="hero-cta">
                        <Link to="/projects" className="btn btn-primary">View My Work</Link>
                        <Link to="/contact" className="btn btn-secondary">Contact Me</Link>
                    </div>
                </div>
                <div className="hero-image-wrapper animate-floating">
                    <div 
                        className="hero-image-border"
                        style={tiltStyle}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img src="/profile.png" alt="Profile" className="hero-image" />
                    </div>
                </div>
            </section>

            <section className="skills-section section container">
                <h2 className="section-title">My Skills</h2>
                    <div className="skills-grid">
                        {profile && profile.skills.map((skill, index) => (
                            <div key={index} className="skill-card">
                                {getSkillIcon(skill)}
                                <span className="skill-name">{skill}</span>
                            </div>
                        ))}
                    </div>
            </section>

            <section className="featured-section section container">
                <div className="section-header">
                    <h2 className="section-title">Featured Projects</h2>
                    <Link to="/projects" className="see-all-link">See All Projects &rarr;</Link>
                </div>
                
                {projectsLoading ? (
                    <div className="loading-skeleton">Loading projects...</div>
                ) : (
                    <div className="projects-grid">
                        {featuredProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </section>

            {/* Interactive Dashboard Section */}
            <section className="dashboard-section container">
                <div className="dashboard-grid">
                    <div className="dashboard-card spotify-card">
                        <SpotifyWidget />
                    </div>
                    <div className="dashboard-card game-card">
                        <RhinoRun />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
