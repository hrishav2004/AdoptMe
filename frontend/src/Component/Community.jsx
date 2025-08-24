import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { FaUserCircle, FaMapMarkerAlt, FaHome, FaTachometerAlt, FaListAlt, FaBars, FaTimes, FaUsers, FaPaw } from 'react-icons/fa';
import { PiPawPrintFill } from 'react-icons/pi';
import LoadingIcons from 'react-loading-icons';
import ErrorDisplay from './ErrorDisplay';

const Community = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
  const [error, setError] = useState(null)

  useEffect(() => {
    const getMembers = async () => {
        try {
          const res = await fetch('/api/community', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          const data = await res.json()
          if(!res.ok){
            setError(data.message)
          }
          else{
            setMembers(data.members)
          }
      } catch (err) {
          setError("Some unexpected error occured.")
      }
    }
    getMembers()
  }, []);

  const handleMobileNav = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  if(error){
    return <ErrorDisplay message={error}/>
  }

  if(!members){
      return (
            <div className='flex items-center justify-center p-4 bg-green-100 border border-green-300 rounded-lg'>
                <p className='text-lg font-semibold text-green-800 mr-3'>Loading Community Members</p>
                <LoadingIcons.TailSpin stroke="#6B21A8" />
            </div>
      );
  }

  return (
    <div className="min-h-screen bg-purple-50 flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-6 flex-shrink-0 hidden md:flex flex-col">
            <div className="flex items-center text-purple-700 font-bold text-2xl mb-10">
                <PiPawPrintFill className="text-yellow-400" />
                <span className="mx-2">AdoptMe</span>
            </div>
            <nav className="flex flex-col space-y-3">
                <button onClick={() => navigate('/')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaHome className="mr-4" /> Home</button>
                <button onClick={() => navigate('/dashboard')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaTachometerAlt className="mr-4" /> Dashboard</button>
                <button onClick={() => navigate('/browsepets')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaListAlt className="mr-4" /> Browse Pets</button>
            </nav>
        </aside>

        {/* Mobile Sidebar (Overlay) */}
        <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'backdrop-blur-sm' : 'pointer-events-none opacity-0'}`} onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center text-purple-700 font-bold text-2xl">
                    <PiPawPrintFill className="text-yellow-400" />
                    <span className="mx-2">AdoptMe</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-600 hover:text-purple-700"><FaTimes size={24} /></button>
            </div>
            <nav className="flex flex-col space-y-3">
                <button onClick={() => handleMobileNav('/')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaHome className="mr-4" /> Home</button>
                <button onClick={() => handleMobileNav('/dashboard')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaTachometerAlt className="mr-4" /> Dashboard</button>
                <button onClick={() => handleMobileNav('/browsepets')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaListAlt className="mr-4" /> Browse Pets</button>
            </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center">
                    <button className="md:hidden text-purple-900 mr-4" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars size={24} />
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-purple-900">Our Community</h1>
                </div>
            </header>

            {/* Member Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {members.map(member => (
                <div 
                  key={member._id} 
                  className="bg-white rounded-2xl shadow-lg text-center p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                >
                  <div className="relative w-28 h-28 mx-auto">
                    {member.profilepic ? (
                      <img src={`http://localhost:3000/uploads/${member.profilepic}`} alt={member.fullname} className="w-full h-full rounded-full object-cover border-4 border-purple-200" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200">
                        <FaUserCircle className="text-purple-400 text-6xl" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mt-4 text-purple-900">{member.fullname}</h2>
                  <div className="flex items-center justify-center text-gray-500 mt-1">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{member.city}, {member.state}</span>
                  </div>
                  <div className="inline-flex items-center mt-4 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    <FaPaw className="mr-2" />
                    {member.pets.length} {member.pets.length === 1 ? 'pet' : 'pets'} listed
                  </div>
                </div>
              ))}
            </div>
        </main>
    </div>
  );
};

export default Community;
