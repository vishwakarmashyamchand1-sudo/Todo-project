import { Link } from "react-router";
import { PlusIcon, SunIcon, MoonIcon } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [theme, setTheme] = useState(() => {
    let saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "cream") saved = "aqua";
    return saved || "dark";
  });

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "aqua" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">DailyNotes</h1>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
              {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
            </button>
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
              
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;