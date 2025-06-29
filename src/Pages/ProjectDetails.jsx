import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

const projects = [
  // Same projects array as in Projects.jsx
];

const ProjectDetails = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === parseInt(id));

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Project not found</div>;
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <Link to="/#projects" className="btn btn-ghost mb-8">
          <FaArrowLeft className="mr-2" /> Back to Projects
        </Link>
        
        <div className="card lg:card-side bg-base-100 shadow-xl">
          <figure className="lg:w-1/2">
            <img src="https://placehold.co/600x400" alt={project.title} />
          </figure>
          <div className="card-body lg:w-1/2">
            <h2 className="card-title text-3xl">{project.title}</h2>
            <p className="text-lg">{project.description}</p>
            
            <div className="my-4">
              <h3 className="font-bold text-lg mb-2">Technologies Used:</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="badge badge-primary">{tech}</span>
                ))}
              </div>
            </div>
            
            <div className="my-4">
              <h3 className="font-bold text-lg mb-2">Key Features:</h3>
              <ul className="list-disc pl-5">
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="card-actions justify-end mt-4">
              <a href="#" className="btn btn-primary">
                Live Demo <FaExternalLinkAlt className="ml-2" />
              </a>
              <a href="#" className="btn btn-outline">
                View Code <FaGithub className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;