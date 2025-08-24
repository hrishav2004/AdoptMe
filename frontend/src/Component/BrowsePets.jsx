import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { FaUserCircle, FaPaw, FaSignOutAlt, FaHome, FaTachometerAlt, FaTimes, FaVenusMars, FaCat, FaDog, FaBars, FaListAlt, FaUsers } from 'react-icons/fa';
import { PiPawPrintFill } from 'react-icons/pi';
import LoadingIcons from 'react-loading-icons';
import ErrorDisplay from './ErrorDisplay';

// --- Reusable Profile Menu ---
const ProfileMenu = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="block w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                {user.user && user.user.profilepic ? <img src={`http://localhost:3000/uploads/${user.user.profilepic}`} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-purple-100 flex items-center justify-center"><FaUserCircle className="text-purple-400 text-5xl" /></div>}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-50 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-bold text-purple-900">{user.user.fullname}</p>
                        <p className="text-sm text-gray-500 truncate">{user.user.email}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Owner Contact Modal ---
const OwnerDetailModal = ({ owner, pet, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><FaTimes size={24} /></button>
            <div className="w-full h-56 bg-purple-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                {pet.photo ? (
                    <img src={`http://localhost:3000/uploads/${pet.photo}`} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                    <FaPaw className="text-purple-300 text-8xl" />
                )}
            </div>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Contact Owner</h2>
            <div className="space-y-3 text-gray-700 mb-6">
                <p><strong>Name:</strong> {owner.fullname}</p>
                <p><strong>Email:</strong> {owner.email}</p>
                <p><strong>Contact:</strong> {owner.contact}</p>
                <p><strong>Address:</strong> {`${owner.locality}, ${owner.city}, ${owner.state}, ${owner.country}`}</p>
            </div>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg">
                <p className="font-bold">Disclaimer</p>
                <p className="text-sm">In-app communication is not yet available. Please contact the owner via email or phone. We are not responsible for any offline interactions.</p>
            </div>
        </div>
    </div>
);


// --- Main Browse Pets Component ---
const BrowsePets = () => {
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const [allPets, setAllPets] = useState(null);
    const [filteredPets, setFilteredPets] = useState([]);
    const [filters, setFilters] = useState({ species: 'all', nature: 'all', gender: 'all' });
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const[error, setError] = useState(null)

    useEffect(() => {
        const getAllPets = async () => {
            try{
                const res = await fetch('https://adoptme-bk01.onrender.com/api/pets', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                if(!res.ok){
                    setError(data.message)
                }
                // console.log(data.pets)
                else{
                    setAllPets(data.pets);
                    setFilteredPets(data.pets);
                }
            } catch (err) {
                setError(err)
            }
        }
        getAllPets()
    }, []);

    useEffect(() => {
        if(allPets){
            let tempPets = [...allPets];
            if (filters.species !== 'all') tempPets = tempPets.filter(pet => pet.species === filters.species);
            if (filters.nature !== 'all') tempPets = tempPets.filter(pet => pet.nature === filters.nature);
            if (filters.gender !== 'all') tempPets = tempPets.filter(pet => pet.gender === filters.gender);
            setFilteredPets(tempPets);
        }
    }, [filters, allPets]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleMobileNav = (path) => {
        navigate(path);
        setIsSidebarOpen(false);
    };

    if(error){
        return <ErrorDisplay message={error}/>
    }

    if (!allPets){
        return (
            <div className='flex items-center justify-center p-4 bg-green-100 border border-green-300 rounded-lg'>
                <p className='text-lg font-semibold text-green-800 mr-3'>Loading Pets</p>
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
                    <button onClick={() => navigate('/putforadoption')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaPaw className="mr-4" /> Put for Adoption</button>
                    <button onClick={() => navigate('/community')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaUsers className="mr-4" /> Our Community</button>
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
                    <button onClick={() => navigate('/putforadoption')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaPaw className="mr-4" /> Put for Adoption</button>
                    <button onClick={() => navigate('/community')} className="flex items-center text-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 p-3 rounded-lg transition"><FaUsers className="mr-4" /> Our Community</button>
                </nav>
            </div>


            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <button className="md:hidden text-purple-900 mr-4" onClick={() => setIsSidebarOpen(true)}>
                            <FaBars size={24} />
                        </button>
                        <h1 className="text-3xl sm:text-4xl font-bold text-purple-900">Browse All Pets</h1>
                    </div>
                    <ProfileMenu user={user} />
                </header>

                {/* Filters */}
                <div className="bg-white text-slate-600 p-4 rounded-xl shadow-md mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <select name="species" onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-lg bg-white">
                        <option value="all">All Species</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Parrot">Parrot</option>
                        <option value="Hamster">Hamster</option>
                        <option value="Other">Other</option>
                    </select>
                    <select name="nature" onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-lg bg-white">
                        <option value="all">All Natures</option>
                        <option value="Playful">Playful</option>
                        <option value="Calm">Calm</option>
                        <option value="Energetic">Energetic</option>
                        <option value="Affectionate">Affectionate</option>
                        <option value="Shy">Shy</option>
                    </select>
                    <select name="gender" onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-lg bg-white">
                        <option value="all">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                {/* Pet List */}
                <div className="space-y-6">
                    {filteredPets.length > 0 ? (
                        filteredPets.map(pet => (
                            <div key={pet._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                <div className="w-32 h-32 bg-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    {pet.photo ? (
                                        <img 
                                        src={`http://localhost:3000/uploads/${pet.photo}`} 
                                        alt={pet.name} 
                                        className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        // Fallback icon if no photo exists
                                        <FaPaw className="text-purple-300 text-6xl" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-purple-800">{pet.name}</h2>
                                    <p className="text-gray-600">{pet.breed} &bull; {pet.gender} &bull; {pet.nature}</p>
                                    <p className="mt-2 text-gray-700">{pet.description}</p>
                                    <p className="text-sm text-gray-500 mt-2">Owner: {pet.owner.fullname}</p>
                                </div>
                                <button onClick={() => { setSelectedOwner(pet.owner); setSelectedPet(pet); }} className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition">
                                    Adopt
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-purple-800">No pets match your criteria!</h2>
                            <p className="text-gray-600 mt-2">Try adjusting your filters to find more friends.</p>
                        </div>
                    )}
                </div>
            </main>

            {selectedOwner && <OwnerDetailModal owner={selectedOwner} pet={selectedPet} onClose={() => { setSelectedOwner(null); setSelectedPet(null); }} />}
        </div>
    );
};

export default BrowsePets;
