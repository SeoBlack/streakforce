
import { FaPen, FaCog } from "react-icons/fa";

const ProfileEditPage = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center pt-6 pb-10">
      {/* Card */}
      <div className="relative w-[300px] sm:w-[340px] bg-white rounded-2xl shadow-md px-5 pb-6 pt-10">
        {/* Settings */}
        <button
          aria-label="Settings"
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white shadow-md grid place-items-center hover:bg-slate-50 active:scale-95"
        >
          <FaCog className="text-slate-500 text-sm" />
        </button>

        {/* Avatar với viền dài */}
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* Viền kéo dài */}
            <div className="w-28 h-32 rounded-full bg-emerald-400 flex items-center justify-center">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover bg-white"
              />
            </div>
            {/* Nút edit */}
            <button
              aria-label="Edit avatar"
              className="absolute bottom-2 right-4 h-7 w-7 rounded-full bg-white shadow grid place-items-center hover:bg-slate-50 active:scale-95"
            >
              <FaPen className="text-slate-600 text-[11px]" />
            </button>
          </div>

          {/* Name */}
          <div className="mt-3 flex items-center gap-1.5">
            <h1 className="text-[18px] sm:text-[20px] font-extrabold text-slate-800 tracking-tight">
              Sarah Johnson
            </h1>
            <button aria-label="Edit name" className="text-slate-500">
              <FaPen className="text-xs" />
            </button>
          </div>
        </div>

        {/* Inputs */}
        <form className="mt-5 space-y-3">
          {/* Role */}
          <label className="block">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-white">
              <FaPen className="text-slate-400 text-xs shrink-0" />
              <input
                type="text"
                defaultValue="Habit Champion ⚡"
                className="w-full bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-400 underline decoration-dotted underline-offset-4"
              />
            </div>
          </label>

          {/* Email */}
          <label className="block">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-white">
              <FaPen className="text-slate-400 text-xs shrink-0" />
              <input
                type="email"
                placeholder="email@email.com"
                className="w-full bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-400"
              />
            </div>
          </label>

          {/* Phone */}
          <label className="block">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-white">
              <FaPen className="text-slate-400 text-xs shrink-0" />
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-400"
              />
            </div>
          </label>

          {/* Password */}
          <label className="block">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-white">
              <FaPen className="text-slate-400 text-xs shrink-0" />
              <input
                type="password"
                placeholder="********"
                className="w-full bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-400 tracking-widest"
              />
            </div>
          </label>

          {/* Save */}
          <button
            type="submit"
            className="mt-4 w-full h-11 rounded-[14px] font-semibold text-white tracking-wide
                       bg-gradient-to-r from-emerald-500 to-emerald-600
                       shadow-[0_6px_20px_rgba(16,185,129,0.35)]
                       active:scale-[0.99] hover:opacity-95 transition"
          >
            SAVE
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
