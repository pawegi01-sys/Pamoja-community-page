import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-600">
          Community Hub
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition">Pricing</a>
        </nav>
        <a href="#pricing" className="bg-orange-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-orange-700 transition duration-300">
          Join
        </a>
      </div>
    </header>
  );
};

export default Header;
