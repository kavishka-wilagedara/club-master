import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react';

const UserHelp = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all messages when the component mounts
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:7000/api/v1/help/all');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load help messages',
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (helpId, fullName) => {
        // Confirmation dialog using SweetAlert2
        Swal.fire({
            title: 'Are you sure?',
            html: `You are about to delete the message from <b>${fullName}</b>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:7000/api/v1/help/${helpId}/delete`);
                    // Refresh the list after deletion
                    fetchMessages();
                    
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The message has been deleted successfully.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    });
                } catch (error) {
                    console.error('Error deleting message:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete the message',
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                    });
                }
            }
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">User Help Messages</h1>
                        <p className="text-blue-100">Manage incoming help requests</p>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {messages.length === 0 ? (
                                <div className="text-center p-8 text-gray-500">
                                    No help messages found
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {messages.map((message) => (
                                            <tr key={message.helpId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{message.helpId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{message.fullName}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{message.email}</div>
                                                    <div className="text-sm text-gray-500">{message.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {message.faculty}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs overflow-hidden text-ellipsis">
                                                        {message.message}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        onClick={() => handleDelete(message.helpId, message.fullName)}
                                                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserHelp;