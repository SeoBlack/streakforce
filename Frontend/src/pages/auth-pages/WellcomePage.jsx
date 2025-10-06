import React from "react";
import logo from "../../assets/logo.svg";
import Image from "../../assets/wellcome-image.png";
import Button from "../../components/UI/Button";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 pb-16 sm:pb-20">
        <div className=" sm:mb-10">
          <div className="w-24 h-24 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-red-400 rounded-2xl flex items-center justify-center shadow-lg">
            <img
              src={logo}
              alt="StreakForce Logo"
              className="w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
          </div>
        </div>
        <h1 className="text-4xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          StreakForce
        </h1>

        {/* Tagline */}
        <p className="text-xl text-center sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2">
          Build habits together. Keep
          <br />
          streaks alive as a team.
        </p>

        <div className=" md:mb-12 lg:mb-16">
          <div className="w-[20rem] h-[18rem] sm:w-72 sm:h-52 md:w-80 md:h-56 lg:w-96 lg:h-64 rounded-3xl overflow-hidden">
            <img
              src={Image}
              alt="Team building habits illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 pb-6 sm:pb-8">
        <Button
          to="/login"
          className=" bg-color-1 hover:bg-color-2 cursor-pointer active:bg-color-3 text-white"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
