import React from "react";
import { FaPen, FaCog } from "react-icons/fa";


const ProfileEditPage = () => {
  const [nameEditing, setNameEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    role: "Habit Champion ⚡",
    email: "",
    phone: "",
    password: "",
  });
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handlePickAvatar = () => fileRef.current?.click();
  const handleAvatarFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f) console.log("Picked avatar:", f.name);
  };
  const handleChange =
    (k: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((p) => ({ ...p, [k]: e.target.value }));
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-start justify-center p-4">
      {/* Card */}
      <div className="relative w-full max-w-[360px] rounded-[22px] bg-[#F4F8FC] shadow-[0_3px_0_rgba(2,6,23,0.02),0_22px_40px_rgba(2,6,23,0.08)] ring-1 ring-black/5 px-5 pt-8 pb-6">
        {/* Floating settings */}
        <button
          aria-label="Open settings"
          className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full bg-white shadow-[0_6px_16px_rgba(2,6,23,0.12)] hover:bg-slate-50 active:scale-95 transition"
        >
          <FaCog className="text-slate-600" />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="User avatar"
              className="h-24 w-24 rounded-full object-cover ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#F4F8FC] shadow"
            />
            <button
              aria-label="Edit avatar"
              onClick={handlePickAvatar}
              className="absolute -bottom-1 -right-1 h-7 w-7 grid place-items-center rounded-full bg-white shadow-[0_6px_18px_rgba(2,6,23,0.12)] hover:bg-slate-50 active:scale-95"
            >
              <FaPen className="text-slate-700 text-[11px]" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFile}
              className="sr-only"
            />
          </div>

          {/* Name */}
          <div className="mt-3 flex items-center gap-2">
            {nameEditing ? (
              <input
                aria-label="Edit name"
                defaultValue="Sarah Johnson"
                onBlur={() => setNameEditing(false)}
                autoFocus
                className="text-[21px] font-extrabold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-none"
              />
            ) : (
              <h1 className="text-[21px] font-extrabold text-slate-900">
                Sarah Johnson
              </h1>
            )}
            <button
              aria-label="Edit name"
              onClick={() => setNameEditing((v) => !v)}
              className="h-6 w-6 grid place-items-center rounded-full hover:bg-slate-200/80 text-slate-600"
            >
              <FaPen className="text-[11px]" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {[
            { key: "role", ph: "Your role", dotted: true },
            { key: "email", ph: "email@email.com" },
            { key: "phone", ph: "Phone number" },
            { key: "password", ph: "********" },
          ].map((f) => (
            <label key={f.key} className="block">
              <div className="flex items-center gap-2 rounded-[14px] bg-white ring-1 ring-slate-200 px-3 py-3 shadow-[0_1px_0_rgba(2,6,23,0.04),0_10px_20px_rgba(2,6,23,0.06)]">
                <FaPen className="text-slate-400 text-xs shrink-0" />
                <input
                  type={f.key === "password" ? "password" : "text"}
                  placeholder={f.ph}
                  value={(formData as any)[f.key]}
                  onChange={handleChange(f.key as keyof typeof formData)}
                  className={`w-full bg-transparent outline-none text-[14px] text-slate-700 placeholder-slate-400 ${
                    f.dotted ? "underline decoration-dotted underline-offset-4" : ""
                  }`}
                />
              </div>
            </label>
          ))}

          {/* Save */}
          <button
            type="submit"
            className="relative mt-4 w-full h-12 rounded-[14px] font-semibold text-white tracking-wide
                       bg-gradient-to-r from-[#1CD977] to-[#03A864]
                       shadow-[0_10px_30px_rgba(3,168,100,0.3)]
                       before:content-[''] before:absolute before:inset-x-6 before:top-[6px] before:h-6 before:rounded-full
                       before:bg-[radial-gradient(90%_140%_at_50%_0%,_rgba(255,255,255,0.8),_rgba(255,255,255,0)_70%)]
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
