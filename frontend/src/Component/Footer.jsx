import React from "react";

const Footer = () => (
  <footer className="w-full bg-purple-800 text-yellow-100 py-6 mt-auto">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
      <div className="mb-2 md:mb-0">
        &copy; {new Date().getFullYear()} AdoptMe. All rights reserved.
      </div>
      <div className="flex space-x-4">
        <a href="#" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Terms</a>
      </div>
    </div>
  </footer>
);

export default Footer;