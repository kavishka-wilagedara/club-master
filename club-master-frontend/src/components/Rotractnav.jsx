import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../common/UserContext";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import Swal from "sweetalert2";
import axios from "axios";

const Rotractnav = ({
  clubEventPage,
  clubNewsPage,
  clubLogoUrl,
  clubName,
  clubId,
  clubDescription,
  clubVision,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleUnEnroll = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to unenroll from this club. This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, unenroll!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:7000/api/v1/club/${user.id}/unroll-member/${clubId}`
        );
        console.log(response.data);

        await Swal.fire({
          title: "Unenrolled!",
          text: "You have been successfully unenrolled from the club.",
          icon: "success",
        });

        navigate("/clubHome");
      }
    } catch (error) {
      console.log("Error while unenrolling member", error);

      await Swal.fire({
        title: "Error!",
        text: "An error occurred while unenrolling. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-blue-600 shadow-lg" : "bg-white shadow-md"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a className="flex items-center" href="/">
          <div
            className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
              isScrolled
                ? "border-white bg-white"
                : "border-2 border-blue-500 p-1 bg-white shadow-lg"
            }`}
          >
            <img
              src={clubLogoUrl}
              alt="Rotract Club Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
          <span
            className={`ml-3 font-bold text-xl transition-colors duration-300 hidden md:block ${
              isScrolled ? "text-white" : "text-blue-600"
            }`}
          >
            {clubName}
          </span>
        </a>

        <div className="flex items-center space-x-4 md:space-x-8">
          <div
            className="hidden md:flex items-center space-x-14"
            style={{ marginRight: "210px" }}
          >
            <Link
              to="/"
              className={`transition duration-300 text-lg font-medium ${
                isScrolled
                  ? "text-white hover:text-blue-200"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              to={{
                pathname: "/rotractabout",
                state: { clubDescription, clubVision }, // Pass club description and vision
              }}
              className={`transition duration-300 text-lg font-medium ${
                isScrolled
                  ? "text-white hover:text-blue-200"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              About
            </Link>
            <Link
              to="/rotractcontact"
              className={`transition duration-300 text-lg font-medium ${
                isScrolled
                  ? "text-white hover:text-blue-200"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              Contact
            </Link>
            <Link
              to="/clubHome"
              className={`transition duration-300 text-lg font-medium ${
                isScrolled
                  ? "text-white hover:text-blue-200"
                  : "text-gray-800 hover:text-blue-600"
              }`}
            >
              Clubs
            </Link>
          </div>

          <div
            className="hidden md:flex items-center space-x-4"
            style={{ marginRight: "-100px" }}
          >
            <Link
              to={clubEventPage}
              className={`transition duration-300 px-5 py-3 rounded-full text-lg font-medium flex items-center ${
                isScrolled
                  ? "bg-white text-blue-600 hover:bg-blue-100"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
              }`}
            >
              <span>Events</span>
            </Link>
            <Link
              to={clubNewsPage}
              className={`transition duration-300 px-5 py-3 rounded-full text-lg font-medium flex items-center ${
                isScrolled
                  ? "bg-white text-blue-600 hover:bg-blue-100"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
              }`}
            >
              <span>News</span>
            </Link>

            <button
              className={`transition duration-300 px-5 py-3 rounded-full text-lg font-medium flex items-center ${
                isScrolled
                  ? "bg-white text-red-600 hover:bg-red-50"
                  : "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg"
              }`}
              onClick={handleUnEnroll}
            >
              <span>Unenroll</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Rotractnav;