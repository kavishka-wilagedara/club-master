import React, { useContext, useState } from 'react';
import { Info, Users, Shield, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar";
import { UserContext } from '../common/UserContext';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';


const ClubEnrollment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [enrollmentKey, setEnrollmentKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(UserContext); 

  const clubId = searchParams.get('clubId');

  const handleEnrollment = async (e) => {
    e.preventDefault();
    try {
      if(enrollmentKey != clubId){
        Swal.fire({
          title: "Enrollment key is incorrect",
          icon: "error",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#d33",
          background: "#fff",
          customClass: {
            title: "swal-title",
            popup: "swal-popup",
          },
        });
        return;

      }
      const response = await axios.post(
        `http://localhost:7000/api/v1/club/${user.id}/enroll-member/${clubId}`,
        { enrollmentKey: enrollmentKey }
      );
      console.log(response.data);
       Swal.fire({
              title: "Welcome to the Club!",
              text: "Enrollment successful",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              background: "#fff",
              customClass: {
                popup: "swal-popup",
              },
            }).then(() => {
              navigate(`/rotract/?clubId=${clubId}`);
            });

    } catch (error) {
      console.log("Error while enrolling:", error);
      Swal.fire({
              title: "Already enrolled",
              icon: "error",
              confirmButtonText: "Try Again",
              confirmButtonColor: "#d33",
              background: "#fff",
              customClass: {
                title: "swal-title",
                popup: "swal-popup",
              },
            });
    } 
  };

  return (
    <div>
      <Sidebar />
      <Navbar/>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-blue-600 ml-48">
        <div className="flex w-full max-w-4xl mx-8 gap-8 mt-12">
          {/* Left side - Enrollment Form */}
          <div className="w-full md:w-1/2 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 h-[450px] mt-24">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent mb-3">
                  Join Your Club
                </h1>
                <p className="text-gray-200 text-lg font-light">
                  Enter your enrollment key to access exclusive club features
                </p>
                <p className="text-gray-100 text-lg font-light mt-3" style={{fontWeight: 'bold'}}>
                 Enrollment key : {clubId}
                </p>
              </div>

              <form onSubmit={handleEnrollment} className="space-y-6">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={enrollmentKey}
                      onChange={(e) => setEnrollmentKey(e.target.value)}
                      className="w-full px-4 py-4 bg-white/10 rounded-xl text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-300 border border-white/10"
                      placeholder="Enter enrollment key"
                      required
                    />
                    <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
                  </div>
                  {error && (
                    <p className="mt-2 text-red-300 text-sm">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform hover:scale-102 transition duration-300 flex items-center justify-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : 'Join Club'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-300 text-sm font-light">
                  Don't have an enrollment key? Contact your club administrator
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Features */}
          <div className="hidden md:flex md:w-1/2 flex-col justify-center space-y-6 p-8">
            <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/10 hover:bg-white/10 hover:border-blue-300/30 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-200 mr-4 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300" />
                <h3 className="text-xl font-semibold text-blue-200 group-hover:text-blue-100 transition-colors duration-300">Connect with Members</h3>
              </div>
              <p className="text-gray-200 font-light leading-relaxed group-hover:text-white transition-colors duration-300">Join a vibrant community of like-minded individuals. Share experiences, collaborate on projects, and make lasting connections.</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/10 hover:bg-white/10 hover:border-purple-300/30 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-purple-200 mr-4 group-hover:scale-110 group-hover:text-purple-300 transition-all duration-300" />
                <h3 className="text-xl font-semibold text-purple-200 group-hover:text-purple-100 transition-colors duration-300">Exclusive Benefits</h3>
              </div>
              <p className="text-gray-200 font-light leading-relaxed group-hover:text-white transition-colors duration-300">Get access to premium resources, special events, and member-only content designed to enhance your club experience.</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl rounded-xl p-6 transform hover:scale-105 transition-all duration-300 border border-white/10 hover:bg-white/10 hover:border-blue-300/30 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="flex items-center mb-4">
                <Info className="h-8 w-8 text-blue-200 mr-4 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300" />
                <h3 className="text-xl font-semibold text-blue-200 group-hover:text-blue-100 transition-colors duration-300">Stay Updated</h3>
              </div>
              <p className="text-gray-200 font-light leading-relaxed group-hover:text-white transition-colors duration-300">Never miss important announcements, upcoming events, or new opportunities within your club community.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubEnrollment;