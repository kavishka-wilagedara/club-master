import React, { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Isacalogin.css';
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar";

const Isacalogin = () => {
    const [enrollmentKey, setEnrollmentKey] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate(); // Initialize useNavigate

    const images = [
        "/100.jpg",
        "/101.jpg",
        "/102.jpg",
        "/103.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [images.length]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Enrollment Key Submitted:", enrollmentKey);
        navigate('/isaca'); // Navigate to the /isaca page
    };
    
    return (
        <div>
            <Dashboard />
            <div className="isaca-login-page">
                <Sidebar />
                <div className="isaca-container">
                    <div className="typewriter-effect">
                        <h1>Uniting Our Community with</h1>
                        <h2>
                            <Typewriter
                                words={['passion.', 'innovation.', 'determination.']}
                                loop={0} // Infinite loop
                                cursor
                                cursorStyle="|"
                                typeSpeed={100}
                                deleteSpeed={50}
                                delaySpeed={1000}
                            />
                        </h2>
                    </div>
                    <div className="isacalogin-content">
                        <div className="isacalogin-header">
                            <img
                                src="/isaclogonew2.png"
                                alt="isaca Logo"
                                className="isacalogin-logo"
                            />
                            <img src={images[currentImageIndex]} alt="Decorative" className="isacabottom-left-image" />
                            
                            <div className="isacaheading-container">
                                <h1 className="isacamain-heading">Join the Movement make the Difference</h1>
                                <h2 className="isacasub-heading">Self Enrollment</h2>
                            </div>
                        </div>
                        <form className="isacaenrollment-form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Enter Enrollment Key"
                                value={enrollmentKey}
                                onChange={(e) => setEnrollmentKey(e.target.value)}
                                className="enrollment-input"
                            />
                            <button type="submit" className="isacasubmit-button">Submit</button>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Isacalogin;