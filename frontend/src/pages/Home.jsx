import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import ProjectCard from '../components/ProjectCard';
import Typewriter from '../components/Typewriter';
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

    return (
        <main className="home">
            <section className="hero container">
                <div className="hero-content">
                    <div className="availability-badge">
                        <span className="dot"></span>
                        Open for Internship / Collaboration
                    </div>
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
                    <div className="hero-image-border">
                        <div className="hero-image-placeholder"></div>
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

            <section className="stats-section section container">
                <div className="stats-grid">
                    <div className="stat-item">
                        <h3 className="stat-number">12+</h3>
                        <p className="stat-label">Tech Stacks Learned</p>
                    </div>
                    <div className="stat-item">
                        <h3 className="stat-number">5+</h3>
                        <p className="stat-label">Projects Built</p>
                    </div>
                    <div className="stat-item">
                        <h3 className="stat-number">100%</h3>
                        <p className="stat-label">Eager to Learn</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
