import React, { useEffect, useState, useRef } from "react";
import { Home, Users, Plus, TrendingUp, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);
  const lastScrollYRef = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = [
    { icon: Home, label: "Home", to: "/home" },
    { icon: Users, label: "Teams", to: "/users" },
    { icon: Plus, label: "Add" },
    { icon: TrendingUp, label: "Stats", to: "/stats" },
    { icon: User, label: "Profile", to: "/profile" },
  ];

  // Scroll detection with debounce
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        if (window.scrollY > lastScrollYRef.current) {
          setShowFooter(false);
        } else {
          setShowFooter(true);
        }
        lastScrollYRef.current = window.scrollY;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 transition-transform duration-300 ${
        showFooter ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = item.to && location.pathname === item.to;
          const commonClasses =
            "flex flex-col items-center p-2 rounded-lg transition-colors";
          const activeClasses = isActive
            ? "text-red-500"
            : "text-gray-400 hover:text-gray-600";

          if (item.to) {
            return (
              <Link
                key={index}
                to={item.to}
                className={`${commonClasses} ${activeClasses}`}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={index}
              className={`${commonClasses} text-gray-400 hover:text-gray-600`}
              onClick={() => console.log(`"${item.label}" button clicked`)}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
