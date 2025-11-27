import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../common/UserContext';
import axios from 'axios';

export default function ClubAdminProfile() {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const response = await axios.get(`http://localhost:7000/api/v1/clubAdmin/getClubAdmin/${user.id}`);
            setUserData(response.data);
            setLoading(false);
        } catch (error) {
            console.log('error fetching user', error);
            setError('Failed to fetch user data');
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear any previous error messages when user types
        if (passwordError) {
            setPasswordError('');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        // Validate password
        if (passwordData.password !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        
        if (passwordData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }
        
        setLoading(true);
        try {
            // Create a new object with only the clubAdminId and password
            const updateData = {
                ...userData,
                password: passwordData.password
            };
            
            await axios.put(`http://localhost:7000/api/v1/clubAdmin/update/${userData.clubAdminId}`, updateData);
            
            // Reset password fields and show success message
            setPasswordData({
                password: '',
                confirmPassword: ''
            });
            setIsChangingPassword(false);
            setUpdateSuccess(true);
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
            
            setLoading(false);
        } catch (error) {
            console.log('error updating password', error);
            setError('Failed to update password');
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="text-red-500 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-xl font-bold mb-2">Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {updateSuccess && (
                    <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md" role="alert">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="font-semibold">Password updated successfully!</p>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">Club Admin Profile</h1>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex justify-center mb-6">
                                <div className="relative">
                                    <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                                        {userData.imageUrl ? (
                                            <img 
                                                src={userData.imageUrl} 
                                                alt={userData.fullName} 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                                                <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs uppercase text-gray-500 font-semibold">Personal Information</h3>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <p className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Full Name:</span>
                                            <span className="font-medium">{userData.fullName}</span>
                                        </p>
                                        <p className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Username:</span>
                                            <span className="font-medium">{userData.username}</span>
                                        </p>
                                        <p className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium">{userData.email}</span>
                                        </p>
                                        <p className="flex justify-between py-2">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-medium">{userData.phone || 'N/A'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs uppercase text-gray-500 font-semibold">Club Information</h3>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                        <p className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Club Admin ID:</span>
                                            <span className="font-medium">{userData.clubAdminId}</span>
                                        </p>
                                        <p className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Club ID:</span>
                                            <span className="font-medium">{userData.clubId}</span>
                                        </p>
                                        <p className="flex justify-between py-2">
                                            <span className="text-gray-600">Member ID:</span>
                                            <span className="font-medium">{userData.memberId}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {isChangingPassword ? (
                            <div className="mt-8 md:col-span-2">
                                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Change Password</h3>
                                    
                                    {passwordError && (
                                        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                            <p>{passwordError}</p>
                                        </div>
                                    )}
                                    
                                    <form onSubmit={handlePasswordSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <div className="relative rounded-md shadow-sm">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={passwordData.password}
                                                    onChange={handlePasswordChange}
                                                    className="block w-full pr-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? (
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
                                        </div>
                                        
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsChangingPassword(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Update Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                >
                                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Change Password
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}