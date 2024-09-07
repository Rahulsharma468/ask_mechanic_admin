'use client'
import { useEffect, useState } from "react";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/project?searchQuery=${searchQuery}&status=${status}`
      );
      const data = await response.json();
      setProjects(data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, status]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDetails = () => {
    setSelectedProject(null);
  };

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold mb-4 text-white">Projects</h1>

      <div className="flex mb-4 space-x-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="accepted">Accepted</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.project._id}
            className={`p-4 border rounded-lg shadow-md ${project.didAccept ? "bg-green-100" : "bg-yellow-100"}`}
            onClick={() => handleProjectClick(project)}
          >
            <h2 className="text-lg font-semibold">{project.project.vehicleProblemDescription}</h2>
            <p>Service Provider: {project.serviceProvider.userPhoneNumber}</p>
            <p>Accepted: {project.didAccept ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
            <p><strong>Project Description:</strong> {selectedProject.project.vehicleProblemDescription}</p>
            <p><strong>Client Name:</strong> {selectedProject.project.userName}</p>
            <p><strong>Client Contact:</strong> {selectedProject.project.userPhoneNumber}</p>
            <p><strong>Service Provider:</strong> {selectedProject.serviceProvider.userPhoneNumber}</p>
            <p><strong>Status:</strong> {selectedProject.didAccept ? "Accepted" : "Pending"}</p>
            <button
              onClick={handleCloseDetails}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
