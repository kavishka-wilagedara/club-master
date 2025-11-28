import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExecutivePanel() {
    const backendUrl=import.meta.env.VITE_BACKEND_URL;

    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [executivePanelMembers, setExecutivePanelMembers] = useState([]);
    const [loadingPanel, setLoadingPanel] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    // Setup axios defaults or use interceptors for authentication headers if needed
    // This might be needed if your backend requires authentication
    useEffect(() => {
        // You might need to add authentication token here if required
        // axios.defaults.headers.common['Authorization'] = `Bearer ${yourAuthToken}`;
        
        // Fetch clubs data from the backend
        const fetchClubs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backendUrl}/club/all`);
                setClubs(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching clubs:', error);
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleViewPanel = async (club) => {
        setSelectedClub(club);
        setShowModal(true);
        setLoadingPanel(true);
        
        try {
            const response = await axios.get(`${backendUrl}/execution-panel/${club.clubId}`);
            setExecutivePanelMembers(response.data);
        } catch (error) {
            console.error('Error fetching executive panel:', error);
        } finally {
            setLoadingPanel(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedClub(null);
        setExecutivePanelMembers([]);
    };

    const handleDeleteMember = async (member) => {
        if (!window.confirm(`Are you sure you want to remove ${member.memberName} from the executive panel?`)) {
            return;
        }

        try {
            setDeleting(true);
            
            // Create the DeleteExecutiveDTO required by the backend
            const deleteExecutiveDTO = {
                memberId: member.memberId,
                role: member.role
            };
            
            // Method 1: Using a more explicitly formatted request with appropriate headers
            await axios({
                method: 'DELETE',
                url: `${backendUrl}/execution-panel/delete/${selectedClub.clubId}`,
                data: deleteExecutiveDTO,
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                    // 'Authorization': `Bearer ${yourAuthToken}`,
                }
            });
            
            // Alternative method (comment out the above and use this if needed)
            // const response = await fetch(`${backendUrl}/execution-panel/delete/${selectedClub.clubId}`, {
            //     method: 'DELETE',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         // Add any authentication headers if needed
            //     },
            //     body: JSON.stringify(deleteExecutiveDTO)
            // });
            // 
            // if (!response.ok) {
            //     throw new Error(`Failed with status: ${response.status}`);
            // }
            
            // After successful deletion, update the members list
            setExecutivePanelMembers(executivePanelMembers.filter(m => 
                !(m.memberId === member.memberId && m.role === member.role)
            ));
            
        } catch (error) {
            console.error('Error deleting executive panel member:', error);
            alert(`Failed to delete executive panel member. ${error.response?.status === 403 ? 'You may not have permission to perform this action.' : 'Please try again.'}`);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Executive Panel</h1>
                <div className="bg-blue-100 rounded-lg px-4 py-2">
                    <span className="text-blue-800 font-medium">{clubs.length} Clubs</span>
                </div>
            </div>

            {clubs.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No clubs found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club) => (
                        <div 
                            key={club.clubId} 
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl text-gray-800 mb-2 truncate">{club.clubName}</h3>
                                <p className="text-gray-600 text-sm mb-4 truncate">{club.clubEmail}</p>
                                
                                <div className="flex items-center mb-6">
                                    <Users size={18} className="text-gray-400 mr-2" />
                                    <span className="text-gray-700">
                                        {club.positionHoldingMembersAndRoles ? club.positionHoldingMembersAndRoles.length : 0} Members with Positions
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={() => handleViewPanel(club)}
                                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md transition-colors duration-300"
                                >
                                    View Panel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Executive Panel Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex justify-between items-center">
                            <h2 className="text-white text-xl font-bold">{selectedClub?.clubName} - Executive Panel</h2>
                            <button 
                                onClick={closeModal}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            {loadingPanel ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : executivePanelMembers.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">No executive panel members found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {executivePanelMembers.map((member, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
                                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full overflow-hidden">
                                                {member.imageUrl ? (
                                                    <img 
                                                        src={member.imageUrl} 
                                                        alt={member.memberName} 
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                                                        <span className="text-xl font-bold">
                                                            {member.memberName.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">{member.memberName}</h4>
                                                <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                                <div className="mt-1 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                                    {member.role}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteMember(member)}
                                                disabled={deleting}
                                                className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors duration-300"
                                                title="Remove from executive panel"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}