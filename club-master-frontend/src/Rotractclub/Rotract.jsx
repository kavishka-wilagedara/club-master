import React, { useState, useEffect } from "react";
import "./Rotract.css";
import { Typewriter } from "react-simple-typewriter";
import Rotractnav from "../components/Rotractnav";
import Rotractfooter from "../components/Rotractfooter";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const Rotract = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [alternateImage, setAlternateImage] = useState("revent2.jpg");
  const [isImpactVisible, setIsImpactVisible] = useState(false);
  const [counts, setCounts] = useState({ members: 0, projects: 0, awards: 0 });

  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const [club, setClub] = useState({});
  const [project, setProjects] = useState([]);
  const [awards, setAwards] = useState([]);
  const [currentAwardIndex, setCurrentAwardIndex] = useState(0);

  const getAllAwardsByClub = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/v1/award/${clubId}/getAllAwardsByClubId`
      );
      setAwards(response.data);
      console.log("fetch awards", response.data);
    } catch (error) {
      console.log("Error while getting awards", error);
    }
  };

  const getAllProjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/v1/project/${clubId}/getAllProjectsByClubId`
      );
      console.log("fetch projects", response.data);
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (clubId) {
      getClub();
      getAllProjects();
      getAllAwardsByClub();
    }
  }, [clubId]);

  const getClub = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7000/api/v1/club/findClub/${clubId}`
      );
      console.log(response.data);
      setClub(response.data);
    } catch (error) {
      console.log("Error while getting club", error);
    }
  };

  useEffect(() => {
    // Image carousel effect
    if (club.backgroundImageUrls && club.backgroundImageUrls.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % club.backgroundImageUrls.length
        );
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [club.backgroundImageUrls]);

  useEffect(() => {
    // Alternate image toggling
    const alternateInterval = setInterval(() => {
      setAlternateImage((prevImage) =>
        prevImage === "revent2.jpg" ? "revent1.jpg" : "revent2.jpg"
      );
    }, 2000);

    return () => clearInterval(alternateInterval);
  }, []);

  useEffect(() => {
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.5 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Observer for the "Our Impact" section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsImpactVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    const impactSection = document.querySelector(".impact-container");
    if (impactSection) {
      observer.observe(impactSection);
    }

    return () => {
      if (impactSection) observer.unobserve(impactSection);
    };
  }, []);

  useEffect(() => {
    if (isImpactVisible) {
      const targetCounts = { members: 500, projects: 100, awards: 20 };
      const duration = 2000; // Animation duration in milliseconds
      const interval = 20; // Interval time in milliseconds

      Object.keys(targetCounts).forEach((key) => {
        const increment = targetCounts[key] / (duration / interval);

        let currentValue = 0;
        const intervalId = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetCounts[key]) {
            currentValue = targetCounts[key];
            clearInterval(intervalId);
          }
          setCounts((prev) => ({ ...prev, [key]: Math.floor(currentValue) }));
        }, interval);
      });
    }
  }, [isImpactVisible]);

  const avenues = [
    {
      title: "Club Service",
      description:
        "We work together to strengthen fellowship among our members through continuous and coordinated teamwork.",
      icon: "/rr1.png",
    },
    {
      title: "Community Service",
      description:
        "Our primary intention is to spread the essence of true community service through every step we take and every project we do.",
      icon: "/rr2.png",
    },
    {
      title: "Professional Development",
      description:
        "Our main purpose is to encourage our members and fellow Rotaractors to serve the community through their skills, to share them with others and learn through fellowship.",
      icon: "/rr3.png",
    },
    {
      title: "International Service",
      description:
        "Our aim is to build up fellowships with Rotaractors around the world but also to promote our culture and heritage and promote humanitarian work around the world.",
      icon: "/rr4.png",
    },
    {
      title: "Sports and Recreational Activities",
      description:
        "Our main aim is to encourage positive development in the sportsmanship of the club members & their enthusiasm regarding sports.",
      icon: "/rr5.png",
    },
  ];

  // Add this useEffect for awards carousel
  useEffect(() => {
    const awardTimer = setInterval(() => {
      setCurrentAwardIndex((prevIndex) =>
        prevIndex === awards.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(awardTimer);
  }, [awards]);

  return (
    <div>
      <Rotractnav
        clubNewsPage={`/rotractnews?clubId=${club.clubId}&clubName=${club.clubName}`}
        clubEventPage={`/rotractevent?clubId=${club.clubId}&clubName=${club.clubName}`}
        clubLogoUrl={club.clubLogoUrl}
        clubName={club.clubName}
        clubId={club.clubId}
        clubDescription={club.clubDescription}
        clubVision={club.clubVision}
      />

      {/* Background Section */}
      {club.backgroundImageUrls && club.backgroundImageUrls.length > 0 && (
        <div
          className="background-container"
          style={{
            backgroundImage: `url(${club.backgroundImageUrls[currentImageIndex]})`,
          }}
        >
          <div className="text-overlay">
            <h1 className="p-5" style={{ width: "1800px" }}>
              {club.clubVision}
              <div className="typewriter-text2 mt-4"></div>
            </h1>
          </div>
        </div>
      )}

      {/* Interface Below the Background */}
      <div className="interface-container">
        <header className="interface-header animate-on-scroll">
          <h1>Welcome to {club.clubName} Club of University of Kelaniya</h1>
          <p>Making a Positive Impact on the Society since 2010</p>
        </header>

        <div className="interface-content">
          <div className="intro animate-on-scroll">
            <p>
              {club.clubName} is a club for young people focused on community
              service, leadership development, and networking. It is part of
              Rotary International and aims to create positive change through
              various local and international projects.
            </p>
          </div>

          <div className="images animate-on-scroll">
            <img src="/roci1.jpg" alt="Group 1" className="image" />
            <img src="/roci2.jpg" alt="Group 2" className="image" />
            <img src="/nnn.jpg" alt="Group 3" className="image" />
            <img src="/roci3.jpg" alt="Group 3" className="image" />
          </div>

          <div className="video-section animate-on-scroll">
            <p>Take a look at Project 'Mathru'</p>
            <div className="video-placeholder">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/1wDJICF5C7Y?si=uF4pE1V5ikm653kX"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Main Avenues Interface */}
      <div className="avenues-container">
        <h2>Main Avenues</h2>
        <div className="avenues">
          {avenues.map((avenue, index) => (
            <div key={index} className="avenue-card animate-on-scroll">
              <img
                src={avenue.icon}
                alt={`${avenue.title} Icon`}
                className="avenue-icon"
              />
              <h3>{avenue.title}</h3>
              <p>{avenue.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Interface */}
      <section className="pg-container">
  <header className="pg-header">
    <h2 className="pg-title">Latest Projects</h2>
    <div className="pg-title-accent"></div>
  </header>

  {project.length > 0 ? (
    <div className="pg-grid" style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '50px', 

    }}>
      {project.map((project, index) => (
        <article 
          className="pg-card" 
          key={index} 
          style={{ 
            width: 'calc(25% - 23px)', 
            minWidth: '280px', 
            maxWidth: '320px',
            marginBottom: '10px'
          }}
        >
          <div className="pg-card-media">
            <img src={project.projectImageUrl} alt={project.title} />
            <div className="pg-card-overlay">
              <span className="pg-view-btn">View Project</span>
            </div>
          </div>
          <div className="pg-card-body">
            <span className="pg-card-date">{project.date}</span>
            <h3 className="pg-card-title">{project.projectName}</h3>
            <p className="pg-card-desc">{project.description}</p>

            <ul className="pg-card-details">
              <li className="pg-detail-item">
                <div className="pg-detail-icon">📅</div>
                <div className="pg-detail-content">
                  <span className="pg-detail-label">Published</span>
                  <span className="pg-detail-value">
                    {project.publishedDate}
                  </span>
                </div>
              </li>
              <li className="pg-detail-item">
                <div className="pg-detail-icon">👤</div>
                <div className="pg-detail-content">
                  <span className="pg-detail-label">Publisher</span>
                  <span className="pg-detail-value">
                    {project.publisherName}
                  </span>
                </div>
              </li>
              <li className="pg-detail-item">
                <div className="pg-detail-icon">🗓️</div>
                <div className="pg-detail-content">
                  <span className="pg-detail-label">Event Date</span>
                  <span className="pg-detail-value">
                    {project.projectHeldDate}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <div className="pg-empty">
      <div className="pg-empty-illustration">
        <svg
          width="120"
          height="100"
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="20"
            width="80"
            height="60"
            rx="2"
            stroke="#CBD5E0"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <path
            d="M40 50H80M40 60H70"
            stroke="#CBD5E0"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="35"
            r="8"
            stroke="#CBD5E0"
            strokeWidth="2"
          />
        </svg>
      </div>
      <p className="pg-empty-text">No projects found.</p>
      <p className="pg-empty-hint">Check back later for new projects.</p>
    </div>
  )}
</section>

      {/* Report Interface */}
      <div className="report-container animate-on-scroll">
        {/* Left section with text */}
        <div className="report-left-section">
          <h1>
            Stay Updated with the Latest <span className="red-text">NEWS!</span>
          </h1>
          <p>
            Stay updated with the latest happenings in Rotaract! Discover
            inspiring stories, impactful projects, and global initiatives led by
            Rotaractors worldwide.
          </p>
          <p>
            Explore how young leaders are driving positive change, fostering
            connections, and making a difference in communities across the
            globe.
          </p>
          <a
            href={`/rotractnews?clubId=${club.clubId}&clubName=${club.clubName}`}
            className="report-button"
          >
            Click here
          </a>
        </div>

        {/* Right section with image */}
        <div className="report-right-section">
          <img src="/uu.jpg" alt="Annual Report" />
        </div>
      </div>

      {/* Rotract Events */}
      <div className="revent-container animate-on-scroll">
        {/* Left Side: Text Content */}
        <div className="revent-text-section">
          <h1>
            See what's new on the RACUOK{" "}
            <span className="red-text">EVENTS!</span>
          </h1>
          <p>
            Explore our dynamic content showcasing the impact of passionate
            individuals and their journey towards positive transformation.
          </p>
          <p>
            Discover how we’re making a difference in society while unlocking
            personal growth. Visit us today and be part of the story – where
            service, friendship, and empowerment unite!
          </p>
          <a
            href={`/rotractevent?clubId=${club.clubId}&clubName=${club.clubName}`}
            className="revent-action-button"
          >
            Click Here
          </a>
        </div>

        {/* Right Side: Images */}
        <div className="revent-image-section">
          <img src="/102.jpg" alt="Alternate Event" className="revent-image" />
        </div>
      </div>

      {/* Awards Section */}
      <div className="awards-section animate-on-scroll">
        <h2>Our Awards & Recognition</h2>
        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentAwardIndex * 100}%)`,
            }}
          >
            {awards.map((award, index) => (
              <div key={index} className="award-slide">
                <div className="award-card">
                  <img
                    src={award.awardImageUrl}
                    alt={award.title}
                    className="award-image"
                  />
                  <div className="award-content">
                    <h3 className="award-heading">{award.awardName}</h3>
                    <p className="award-description">{award.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="navigation-dots">
            {awards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAwardIndex(index)}
                className={`nav-dot ${
                  currentAwardIndex === index ? "active" : ""
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Executive Board */}
      <div className="executive-board-container">
        <div className="board-header">
          <h1>Executive Board</h1>
          <div className="decorative-line"></div>
        </div>

        <div className="board-members">
          {club.positionHoldingMembersAndRoles?.map((member, index) => (
            <div className="member-profile" key={index}>
              <div className="profile-frame">
                <img
                  src={member.profileImage || "/tt1.jpg"}
                  alt={`${member.role} - ${member.memberName}`}
                />
                <div className="member-badge">{member.role}</div>
              </div>
              <div className="member-content">
                <h2>{member.memberName}</h2>
                <div className="contact-info">
                  <span className="email-icon">✉</span>
                  <span>{member.email || "No email provided"}</span>
                </div>
                <div className="member-bio">
                  {member.bio || "Club executive board member"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Impact Section */}
      <div className="impact-container animate-on-scroll">
        <h2 className="impact-heading">Our Impact in Figures</h2>
        <div className="impact-box">
          <div className="impact-item">
            <p className="impact-number">
              {club.associatedMembers ? club.associatedMembers.length : 0}+
            </p>
            <p className="impact-label">Members</p>
          </div>
          <div className="impact-item">
            <p className="impact-number">{project.length}+</p>
            <p className="impact-label">Projects</p>
          </div>
          <div className="impact-item">
            <p className="impact-number">{awards.length}+</p>
            <p className="impact-label">Awards</p>
          </div>
        </div>
      </div>

      <Rotractfooter
        clubEmail={club.clubEmail}
        clubImage={club.clubLogoUrl}
        clubName={club.clubName}
        clubVision={club.clubVision}
      />
    </div>
  );
};

export default Rotract;
