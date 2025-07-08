import { Link, useLocation } from "react-router-dom";
import { menuItems } from "./Menu.jsx";
import Logo from "../../assets/logo.png";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={"fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 px-4 md:px-10 py-3 transition duration-300"}
    >
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
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

        {/* Navigation Links + Masuk Button */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:flex md:items-center md:w-auto`}
        >
          <ul className="items-center font-lato text-primary-darkest flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`block py-2 px-3 hover:underline md:p-0 ${
                    location.pathname === item.path
                      ? "text-primary-dark font-bold underline"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)} // auto close menu on mobile
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Masuk Button */}
            <li>
              <div className="relative">
                <Link
                  to="/masuk"
                   className="inline-block border border-primary-dark text-primary-dark hover:text-primary-dark font-semibold py-2 px-5 rounded-xl pt-3 pb-3 hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  Masuk
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
