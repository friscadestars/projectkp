import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/logo.png";
import Profile from "../../../assets/icons/profile.png";
import { useState, useEffect } from "react";

export default function NavbarPrivate() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Ambil role user dari localStorage
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Dynamic Beranda path
  const getBerandaPath = () => {
    if (userRole === "Agen") return "/berandaAgen";
    if (userRole === "Distributor") return "/berandaDistributor";
    if (userRole === "Pabrik") return "/berandaPabrik";
    return "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 px-4 md:px-10 py-3 transition duration-300">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to={getBerandaPath()} className="flex items-center space-x-2">
          <img src={Logo} alt="OrderLink Logo" className="h-10" />
          <span className="text-xl font-bold text-primary-dark">OrderLink</span>
        </Link>

        {/* Hamburger Button (Mobile) */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:flex md:items-center md:w-auto`}
        >
          <ul className="items-center font-lato text-primary-darkest flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
            {/* Only Beranda */}
            <li>
              <Link
                to={getBerandaPath()}
                className={`block py-2 px-3 hover:underline md:p-0 ${
                  location.pathname === getBerandaPath()
                    ? "text-primary-dark font-bold underline"
                    : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
            </li>

            {/* Profile Icon */}
            <img
              src={Profile}
              alt="Profile Logo"
              className="h-8 cursor-pointer"
            />
          </ul>
        </div>
      </div>
    </nav>
  );
}
