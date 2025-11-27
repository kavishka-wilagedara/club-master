import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../common/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ViewClubAdminAwards() {
  const { user } = useContext(UserContext);
  const clubId = user?.id?.split(':')[0];
  const clubAdminId = user?.id;
  
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        if (!clubId) {
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`http://localhost:7000/api/v1/award/${clubId}/getAllAwardsByClubId`);
        setAwards(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching awards:', err);
        setError('Failed to load awards. Please try again later.');
        setLoading(false);
      }
    };

    fetchAwards();
  }, [clubId]);

  // Format date array to readable string
  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return 'No date';
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  const handleDeleteAward = async (awardId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this award. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:7000/api/v1/award/${awardId}/deleteAward`);
        setAwards(awards.filter(award => award.awardId !== awardId));
        Swal.fire(
          'Deleted!',
          'The award has been deleted successfully.',
          'success'
        );
      } catch (err) {
        console.error('Error deleting award:', err);
        Swal.fire(
          'Error!',
          'Failed to delete award. Please try again later.',
          'error'
        );
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading awards...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!awards.length) return <div className="text-center p-4">No awards found for this club.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Club Awards</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map(award => (
          <div key={award.awardId} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Award Image */}
            <div className="h-48 overflow-hidden">
              <img 
                src={award.awardImageUrl} 
                alt={award.awardName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-award.png'; // Fallback image
                }}
              />
            </div>
            
            {/* Award Details */}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{award.awardName}</h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Award ID: </span>{award.awardId}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Date: </span>
                {formatDate(award.awardDate)}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Published: </span>
                {formatDate(award.publishedDate)} at {award.publishedTime?.join(':')}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Publisher: </span>{award.publisherName}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Club: </span>{award.responseClub}
              </p>
              <div className="mt-2">
                <h3 className="font-medium">Description:</h3>
                <p className="text-gray-700">{award.description}</p>
              </div>
              
              {/* Admin Actions */}
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={() => handleDeleteAward(award.awardId)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
     
    </div>
  );
}