import React from "react";



const Background = () => {
  return (
    <div className="w-full">
      {/* Background Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src="/fos.jpg"
          alt="Campus Life"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-start justify-start pl-10 pt-10 z-10">
          <div className="p-10 bg-white bg-opacity-50 rounded-2xl shadow-lg text-left filter brightness-75 ml-10">
            <h2 className="text-3xl md:text-5xl font-bold text-black">
              Your <span className="text-blue-900 font-serif">Campus</span>, Your
              <br />
              <span className="text-blue-900 font-mono">Club</span> Community
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-800">
              Discover, join, and thrive in University of Kelaniya’s
              <br />
              vibrant club ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* New Interface Section */}
      <div className="w-full px-10 py-16 bg-white">
        <h3 className="text-2xl md:text-4xl font-bold text-center mb-8 text-black">
          Empowering Your University Experience
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Leadership Development Card */}
          <div className="p-6 bg-purple-100 rounded-2xl shadow-lg text-center hover:bg-purple-200 transition-colors">
            <div className="mb-4">
              <span className="inline-block p-4 bg-purple-600 text-white rounded-full">
                <i className="fas fa-users"></i>
              </span>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-black">
              Leadership Development
            </h4>
            <p className="text-gray-700">
              We offer workshops and mentoring programs to help you develop
              essential leadership skills, preparing you for roles within clubs
              and beyond.
            </p>
          </div>

          {/* Event Management Card */}
          <div className="p-6 bg-purple-100 rounded-2xl shadow-lg text-center hover:bg-purple-200 transition-colors">
            <div className="mb-4">
              <span className="inline-block p-4 bg-purple-600 text-white rounded-full">
                <i className="fas fa-calendar-alt"></i>
              </span>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-black">Event Management</h4>
            <p className="text-gray-700">
              Learn to plan and execute successful club events with our
              comprehensive event management training, covering budgeting,
              logistics, and promotion.
            </p>
          </div>

          {/* Club Management Card */}
          <div className="p-6 bg-purple-100 rounded-2xl shadow-lg text-center hover:bg-purple-200 transition-colors">
            <div className="mb-4">
              <span className="inline-block p-4 bg-purple-600 text-white rounded-full">
                <i className="fas fa-briefcase"></i>
              </span>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-black">Club Management</h4>
            <p className="text-gray-700">
              Master the art of running successful clubs with our comprehensive
              management training, covering member engagement, financial
              planning, and strategic growth.
            </p>
          </div>
        </div>
      </div>

      {/* Gateway to Campus Community Section */}
      <div className="w-full px-10 py-20 bg-gradient-to-b from-black to-blue-900 text-white">
        <h3 className="text-center text-2xl md:text-4xl font-bold mb-8 text-purple-400">
          Who we are
        </h3>
        <h2 className="text-center text-3xl md:text-5xl font-bold mb-10">
          Your Gateway to Campus <span className="text-blue-400">Community</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {/* Vibrant Clubs */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h4 className="text-4xl font-bold mb-2 text-blue-400">10+</h4>
            <p className="text-lg text-gray-300">Vibrant Clubs</p>
          </div>
          {/* Club Partners */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h4 className="text-4xl font-bold mb-2 text-blue-400">50+</h4>
            <p className="text-lg text-gray-300">Club Partners</p>
          </div>
          {/* Happy Members */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h4 className="text-4xl font-bold mb-2 text-blue-400">9,000+</h4>
            <p className="text-lg text-gray-300">Happy Members</p>
          </div>
          {/* Projects Done */}
          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h4 className="text-4xl font-bold mb-2 text-blue-400">350+</h4>
            <p className="text-lg text-gray-300">Projects Done</p>
          </div>
        </div>
      </div>

      {/* Three-Step Process Section */}
      <div
        className="w-full px-10 py-16 relative bg-cover bg-center text-white"
        style={{
          backgroundImage: "url('/stu.jpg')",
          backgroundPosition: "center 40%",
          minHeight: "500px",
          marginBottom: "0px",
        }}
      >
        <div className="absolute left-10 top-1.0 transform -translate-y-1/2">
          <h4 className="text-3xl font-bold text-purple-400">How it works</h4>
          <p className="text-2xl md:text-5xl font-semibold text-black mt-2">
            A Simple, yet effective three-step process.
          </p>
        </div>
        <div className="mt-[70px]">
          <div className="text-blue-500 text-8xl font-bold">1</div>
          <p className="text-black text-4xl mt-2">Join a Club</p>
        </div>
        <div className="mt-[1px] ml-[250px]">
          <div className="text-pink-500 text-8xl font-bold">2</div>
          <p className="text-black text-4xl mt-2">Club Activities</p>
        </div>
        <div className="mt-[50px] ml-[550px]">
          <div className="text-violet-500 text-8xl font-bold">3</div>
          <p className="text-black text-4xl mt-2">Growth & Scale</p>
        </div>
      </div>
      {/* Principles Guiding Our University Clubs Section */}
<div className="w-full px-10 py-16 bg-white">
  <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">
    The principles guiding our university clubs
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Leadership */}
    <div className="p-6 bg-blue-100 rounded-2xl shadow-lg text-center group hover:bg-blue-500">
      <h4 className="text-xl font-semibold text-blue-600 group-hover:text-white">
        Leadership
      </h4>
      <p className="text-gray-700 mt-2 group-hover:text-white">
        We foster leadership skills, empowering students to take
        initiative and guide their peers towards shared goals and
        visions.
      </p>
    </div>
    {/* Inclusivity */}
    <div className="p-6 bg-purple-100 rounded-2xl shadow-lg text-center group hover:bg-blue-500">
      <h4 className="text-xl font-semibold text-purple-600 group-hover:text-white">
        Inclusivity
      </h4>
      <p className="text-gray-700 mt-2 group-hover:text-white">
        We embrace diversity and create an inclusive environment where all
        students feel welcome, valued, and respected regardless of their
        background.
      </p>
    </div>
    {/* Innovation */}
    <div className="p-6 bg-green-100 rounded-2xl shadow-lg text-center group hover:bg-blue-500">
      <h4 className="text-xl font-semibold text-green-600 group-hover:text-white">
        Innovation
      </h4>
      <p className="text-gray-700 mt-2 group-hover:text-white">
        We encourage creative thinking and innovative approaches to club
        activities, events, and problem-solving within our university
        community.
      </p>
    </div>
    {/* Collaboration */}
    <div className="p-6 bg-pink-100 rounded-2xl shadow-lg text-center group hover:bg-blue-500">
      <h4 className="text-xl font-semibold text-pink-600 group-hover:text-white">
        Collaboration
      </h4>
      <p className="text-gray-700 mt-2 group-hover:text-white">
        We promote teamwork and collaboration among club members,
        fostering a sense of community and shared purpose within our
        university.
      </p>
    </div>
  </div>
</div>

      
      
    </div>
  );
};

export default Background;
