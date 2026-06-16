import './ProjectCard.css';

const getImageUrl = (imageUrl) => {
    if (!imageUrl || !imageUrl.startsWith('/')) {
        return imageUrl;
    }

    return `${import.meta.env.BASE_URL}${imageUrl.slice(1)}`;
};

const ProjectCard = ({ project }) => {
    return (
        <div className="project-card glass-card animate-fade-in">
            <div className={`project-image-container ${!project.image_url ? 'no-image' : ''}`}>
                {project.image_url ? (
                    <img src={getImageUrl(project.image_url)} alt={project.title} className="project-image" />
                ) : (
                    <div className="project-image-fallback">
                        <span className="project-initials">{project.title.substring(0, 2).toUpperCase()}</span>
                    </div>
                )}
                {project.featured && <span className="featured-badge">Featured</span>}
            </div>
            
            <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                
                <div className="tech-stack">
                    {project.tech_stack.map((tech, index) => (
                        <span key={index} className="tech-badge">{tech}</span>
                    ))}
                </div>
                
                <div className="project-links">
                    {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            Code
                        </a>
                    )}
                    {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="project-link primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            Demo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
