import Fire from "../assets/Fire.svg";
import { useHabits } from "../context/habitContextBase";
import { useMemo, useEffect, useState } from "react";
import Button from "./UI/Button";

// Confetti Component
const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random confetti particles
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
    ];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 8,
      rotation: Math.random() * 360,
      drift: -50 + Math.random() * 100,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--drift)) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${particle.left}%`,
              top: "-10%",
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animationDuration: `${particle.animationDuration}s`,
              animationDelay: `${particle.delay}s`,
              transform: `rotate(${particle.rotation}deg)`,
              "--drift": `${particle.drift}px`,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              opacity: 0.9,
            }}
          />
        ))}
      </div>
    </>
  );
};

// StreakCard.jsx
export default function Submission({ checkin, onContinue, onShare }) {
  const { habits } = useHabits();
  const habit = useMemo(
    () => habits.find((habit) => habit._id === checkin.habitId),
    [habits, checkin]
  );
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation completes
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out 3;
        }
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
      <div className="absolute top-0 left-0 min-h-screen w-full h-full flex items-center justify-center bg-gradient-to-b from-orange-400 to-pink-500 p-4 sm:p-6 md:p-8 font-poppins overflow-y-auto">
        {/* Confetti Effect - Only shows once on mount */}
        {showConfetti && <Confetti />}

        <div className="w-full max-w-md flex flex-col items-center justify-center py-8 sm:py-12 relative z-10">
          {/* Streak Display */}
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
            <span className="select-none animate-bounce-slow">
              <img
                src={Fire}
                alt="Fire"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-2xl"
              />
            </span>
            <div className="flex flex-col items-center gap-2 animate-scale-in">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white text-center leading-none drop-shadow-md">
                {checkin.streak || 1}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white/90 text-center">
                Day Streak
              </p>
            </div>
          </div>

          {/* Habit Title */}
          <h2
            className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center px-4 leading-tight drop-shadow-md animate-fade-in"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            {habit?.title || "Your Habit"}
          </h2>

          {/* XP pill */}
          <div
            className="inline-flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold text-base sm:text-lg shadow-lg border-2 border-white/30 animate-fade-in"
            style={{ animationDelay: "0.5s", opacity: 0 }}
          >
            <span className="text-xl sm:text-2xl">⭐</span>
            <span>+{checkin.xp || 20} XP</span>
          </div>

          {/* Buttons */}
          <div
            className="mt-8 sm:mt-10 md:mt-12 w-full max-w-sm space-y-3 sm:space-y-4 px-4 sm:px-0 animate-fade-in"
            style={{ animationDelay: "0.7s", opacity: 0 }}
          >
            <Button
              className=" cursor-pointer w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white text-orange-500 font-semibold text-base sm:text-lg shadow-xl hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              onClick={onContinue}
            >
              Continue
            </Button>

            <Button
              className=" cursor-pointer w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm text-white font-semibold text-base sm:text-lg border-2 border-white/40 hover:bg-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
              onClick={onShare}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
                Share Streak
              </span>
            </Button>
          </div>

          {/* Team avatars + text */}
          <div
            className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in"
            style={{ animationDelay: "0.9s", opacity: 0 }}
          >
            <div className="flex -space-x-3">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Teammate 1"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Teammate 2"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="Teammate 3"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white shadow-md"
              />
            </div>
            <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 text-center">
              Team cheering you on! 🎉
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
