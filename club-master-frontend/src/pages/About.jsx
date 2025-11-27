import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; 

import About_image from "../assets/ab.png";

const services = [
  { name: "Club Event Management" },
  { name: "Membership Registration & Management" },
  { name: "Activity Scheduling" },
  { name: "Communication & Notifications" },
  { name: "Club Finances Management" },
];

const stats = [
  { name: "Active Clubs", value: "10+" },
  { name: "Registered Members", value: "5000+" },
  { name: "Years of Service", value: "5+" },
  { name: "Events Organized", value: "200+" },
];

const About = () => {
  return (
    <div>
      <Navbar />

      <div className="relative isolate overflow-hidden bg-gray-900 py-20 sm:py-24">
        <img
          alt="About Club-master"
          src={About_image}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-200"
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:text-left lg:mx-0">
            <h2 className="text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
              About Club-master
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-800">
              Club-master is a dynamic platform designed to streamline the management of university clubs. With a focus on providing modern solutions, we help student clubs manage their events, members, and communications seamlessly. Whether you're looking to organize a club event, track membership, or keep your members engaged, Club-master is here to simplify the process. Our platform is trusted by universities and clubs alike to enhance their operations and bring their community together.
            </p>
          </div>

          <div className="mt-12 max-w-2xl lg:max-w-none lg:mx-0">
            <h3 className="text-xl font-semibold text-black mb-8 lg:mb-10">
              Our Services
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:gap-10">
              {services.map((service) => (
                <h3
                  key={service.name}
                  className="text-lg font-semibold text-gray-800 hover:text-black transition-colors duration-300"
                >
                  {service.name}
                </h3>
              ))}
            </div>
          </div>

          <div className="mt-16 sm:mt-20">
            <h3 className="text-xl font-semibold text-black mb-8 lg:mb-10">
              Our Achievements
            </h3>
            <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="flex flex-col items-center lg:items-start"
                >
                  <dt className="text-base leading-7 text-gray-800">
                    {stat.name}
                  </dt>
                  <dd className="text-3xl font-bold leading-9 tracking-tight text-black">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
