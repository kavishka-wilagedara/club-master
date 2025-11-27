import React from 'react';
import { Globe, Users } from 'lucide-react';
import { motion } from "framer-motion";

const Rotractabout = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)' }}>
      {/* Hero Section with Dynamic Background */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #ff8080 0%, #ff9999 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
        }}>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%)'
          }} />
        </div>
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Us
          </motion.h1>
          <motion.p
            className="text-xl text-white/90 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Empowering Change Through Service & Leadership
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-20 relative z-10">
        {/* Image and Introduction Card */}
        <motion.div
          className="bg-red-50/80 shadow-xl rounded-xl p-8 mb-12"
          {...fadeInUp}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-102 transition-transform duration-300">
              <img
                src="/rotractabout.png"
                alt="Rotaract Club Members"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-red-500">Our Legacy of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                Sponsored by the Rotary Club of Colombo Uptown, the Rotaract Club of University of Kelaniya was chartered on the 3rd of June 2010 under the Presidency of Rtr. PP Dilanka Weerakoon. With a noble desire to serve humanity, over the past years the club has given spirit and life to numerous projects, making an impact in the lives of countless people across the country by being a beacon of hope.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            className="bg-red-50/80 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl p-8"
            {...fadeInLeft}
          >
            <div className="flex items-start mb-6">
              <div className="p-3 bg-red-100 rounded-lg">
                <Globe className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 ml-4">Our Impact</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              From empowering local communities through education and healthcare projects to championing environmental sustainability and social welfare through innovative initiatives, our dedication to making a positive difference has never wavered. Some of our stellar award-winning projects, where creativity and impact unite to redefine excellence include 'Writing Maze', 'Spectrum', 'RotaTomorrow' and 'Track the Spread'.
            </p>
          </motion.div>

          <motion.div
            className="bg-red-50/80 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl p-8"
            {...fadeInRight}
          >
            <div className="flex items-start mb-6">
              <div className="p-3 bg-red-100 rounded-lg">
                <Users className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 ml-4">Our Strength</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              A driving force behind our achievements has been our strong and enthusiastic membership base. The dedication and determination of our members have enabled us to dream big and turn our aspirations into tangible reality. We take immense pride in nurturing and developing future leaders among thousands of undergraduates who find a sense of purpose and fulfillment through our club.
            </p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { value: "13+", label: "Years of Service" },
            { value: "1000+", label: "Members" },
            { value: "100+", label: "Projects" },
            { value: "4", label: "Award Winning Projects" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-red-50/80 hover:bg-red-100/80 transition-colors duration-300 rounded-xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="text-4xl font-bold text-red-500 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rotractabout;
