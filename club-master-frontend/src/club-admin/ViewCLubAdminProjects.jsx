import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../common/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ViewClubAdminProjects() {
  const { user } = useContext(UserContext);
  const clubId = user?.id?.split(':')[0];
  const clubAdminId = user?.id;
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!clubId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:7000/api/v1/project/${clubId}/getAllProjectsByClubId`);
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [clubId]);

  // Format date array to readable string
  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return 'Invalid date';
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  // Format time array to readable string
  const formatTime = (timeArray) => {
    if (!timeArray || timeArray.length < 3) return '';
    const [hours, minutes, seconds] = timeArray;
    return new Date(0, 0, 0, hours, minutes, seconds).toLocaleTimeString();
  };

  const handleDeleteProject = async (projectId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this project. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:7000/api/v1/project/${projectId}/deleteProject`);
        setProjects(projects.filter(project => project.projectId !== projectId));
        Swal.fire(
          'Deleted!',
          'The project has been deleted successfully.',
          'success'
        );
      } catch (err) {
        console.error('Error deleting project:', err);
        Swal.fire(
          'Error!',
          'Failed to delete project. Please try again later.',
          'error'
        );
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading projects...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!clubId) return <div className="text-center p-4">User information not available</div>;
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Club Projects</h1>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded">
          <p>No projects found for this club. Click 'Add New Project' to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.projectId} className="border rounded-lg overflow-hidden shadow-md bg-white">
              {project.projectImageUrl && (
                <img 
                  src={project.projectImageUrl} 
                  alt={project.projectName} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{project.projectName}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <span className="font-medium">Project Date:</span>
                    <div className="text-gray-600">{formatDate(project.projectHeldDate)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Club:</span>
                    <div className="text-gray-600">{project.responseClub}</div>
                  </div>
                  <div>
                    <span className="font-medium">Published:</span>
                    <div className="text-gray-600">
                      {formatDate(project.publishedDate)} {formatTime(project.publishedTime)}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Publisher:</span>
                    <div className="text-gray-600">{project.publisherName}</div>
                  </div>
                </div>
                
                <div className="flex justify-end items-center space-x-2">
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleDeleteProject(project.projectId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}