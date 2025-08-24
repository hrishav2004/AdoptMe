import React, { useState, useContext } from "react";
import { PiPawPrintFill } from "react-icons/pi";
import { FaBars, FaTimes } from "react-icons/fa"; // 1. Import menu icons
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const Navbar = () => {
  // 2. Add state to manage the mobile menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu on navigation
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://adoptme-bk01.onrender.com/api/logout', {
        method: "POST"
      });
      navigate('/');
      window.location.reload()
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="w-full m-0 p-0 bg-purple-700 fixed top-0 left-0 z-50">
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo or Brand Name */}
          <Link to="/" className="flex items-center text-yellow-100 font-bold text-xl">
            <PiPawPrintFill />
            Adopt<span className="text-green-300">Me</span>
            <PiPawPrintFill />
          </Link>

          {/* 3. Conditional Desktop Navigation Buttons */}
          <div className="hidden md:flex space-x-4">
            {user ? (
              // --- Buttons for LOGGED IN users ---
              <>
                <button
                  onClick={() => handleNavigate('/dashboard')}
                  className="bg-yellow-500 hover:bg-yellow-800 text-red-50 font-semibold py-2 px-4 rounded transition"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              // --- Buttons for LOGGED OUT users ---
              <>
                <button
                  onClick={() => handleNavigate('/register')}
                  className="bg-yellow-500 hover:bg-yellow-800 text-red-50 font-semibold py-2 px-4 rounded transition"
                >
                  Register
                </button>
                <button
                  onClick={() => handleNavigate('/login')}
                  className="bg-green-500 hover:bg-green-800 text-red-50 font-semibold py-2 px-4 rounded transition"
                >
                  Login
                </button>
              </>
            )}
            <button className="bg-pink-400 hover:bg-pink-500 text-red-50 font-semibold py-2 px-4 rounded transition">
              About Us
            </button>
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-yellow-100 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Conditional Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-purple-800">
          <div className="flex flex-col items-center space-y-4 py-4">
            {user ? (
              // --- Mobile buttons for LOGGED IN users ---
              <>
                <button
                  onClick={() => handleNavigate('/dashboard')}
                  className="bg-yellow-600 hover:bg-yellow-800 text-red-50 font-semibold py-2 px-4 rounded transition w-3/4"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition w-3/4"
                >
                  Logout
                </button>
              </>
            ) : (
              // --- Mobile buttons for LOGGED OUT users ---
              <>
                <button
                  onClick={() => handleNavigate('/register')}
                  className="bg-yellow-600 hover:bg-yellow-800 text-red-50 font-semibold py-2 px-4 rounded transition w-3/4"
                >
                  Register
                </button>
                <button
                  onClick={() => handleNavigate('/login')}
                  className="bg-green-600 hover:bg-green-800 text-red-50 font-semibold py-2 px-4 rounded transition w-3/4"
                >
                  Login
                </button>
              </>
            )}
            <button className="bg-pink-400 hover:bg-pink-500 text-red-50 font-semibold py-2 px-4 rounded transition w-3/4">
              About Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;