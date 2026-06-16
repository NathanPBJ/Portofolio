import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import ProjectCard from '../components/ProjectCard';
import './Projects.css';

const Projects = () => {
    const { data: projects, loading, error, refetch } = useFetch('/api/projects');
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Web', 'Mobile', 'Desktop', 'Games'];

    const getCategory = (project) => {
        const stack = project.tech_stack.join(' ').toLowerCase();
        
        if (stack.includes('kotlin') || stack.includes('android')) return 'Mobile';
        if (stack.includes('javafx') || stack.includes('unity')) return 'Games';
        if (stack.includes('electron')) return 'Desktop';
        if (stack.includes('node') || stack.includes('php') || stack.includes('express') || stack.includes('react')) return 'Web';
        
        return 'All';
    };

    const filteredProjects = projects ? projects.filter(p => {
        if (filter === 'All') return true;
        return getCategory(p) === filter;
    }) : [];

    return (
        <main className="projects-page container animate-fade-in">
            <header className="page-header">
                <h1 className="page-title text-gradient">My Work</h1>
                <p className="page-subtitle">A collection of projects I've built to solve real-world problems.</p>
            </header>

            <div className="filter-bar">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        className={`filter-btn ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="projects-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="skeleton-card glass-card"></div>
                    ))}
                </div>
            )}

            {error && (
                <div className="error-state glass-card">
                    <h3>Oops! Something went wrong.</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={refetch}>Try Again</button>
                </div>
            )}

            {!loading && !error && filteredProjects.length === 0 && (
                <div className="empty-state glass-card">
                    <h3>No projects found</h3>
                    <p>Try selecting a different category.</p>
                </div>
            )}

            {!loading && !error && filteredProjects.length > 0 && (
                <div className="projects-grid">
                    {filteredProjects.map((project, index) => (
                        <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }} className="stagger-item">
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default Projects;
