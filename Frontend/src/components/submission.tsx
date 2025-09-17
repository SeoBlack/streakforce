import Fire from "../assets/Fire.svg";

// StreakCard.jsx
export default function StreakCard({
  day = 8,
  xp = 15,
  title = "You've kept the streak alive! 🎉",
  subtitle = "Day 8 completed. Your team is counting on you!",
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-orange-400 to-pink-500 p-4 font-poppins">
      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-orange-400 to-pink-500 text-white shadow-2xl p-6 text-center">
        
        {/* Check Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center">
            <span className="text-green-500 text-4xl leading-none">✔</span>
          </div>
        </div>

        {/* Title & subtitle */}
        <h2 className="font-semibold leading-snug text-[30px] mb-3">
          {title}
        </h2>
        <p className="text-[18px] font-normal mb-8">
          {subtitle}
        </p>

        {/* Streak area */}
        <div className="mt-6">
          <div className="flex items-center justify-center gap-2 text-5xl font-bold">
            <span className="select-none">
              <img src={Fire} alt="Fire" className="w-10 h-10" />
            </span>
            <span>{day}</span>
          </div>
          <p className="mt-2 text-[18px] font-medium">Day Streak</p>
        </div>

        {/* XP pill */}
        {/* XP pill */}
                <div className="inline-flex items-center gap-2 mt-5 px-6 py-2 
                rounded-full bg-orange-400/100 text-white font-bold text-base">
                 <span className="text-yellow-400">⭐</span>
               <span>+{xp} XP</span>
             </div>

    

        {/* Buttons */}
        <div className="mt-8 space-y-4">
          <button className="w-full py-3 rounded-xl bg-white text-orange-500 font-semibold text-[18px] shadow-md hover:bg-gray-50 transition">
            Continue
          </button>

          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-medium text-[16px] border border-white/30 hover:opacity-90 transition">
            <span className="inline-flex items-center gap-2">↪ Share Streak</span>
          </button>
        </div>

        {/* Team avatars + text */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Teammate 1"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Teammate 2"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              alt="Teammate 3"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          </div>
          <p className="text-[14px]">Team cheering you on!</p>
        </div>
      </div>
    </div>
  );
}
