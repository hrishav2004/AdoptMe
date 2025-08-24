import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../Context/UserContext";
import { PetContext } from '../Context/PetContext';
import { FaHome, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaw, FaPen, FaUsers, FaTrash, FaTimes, FaDog, FaListAlt, FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';
import LoadingIcons from 'react-loading-icons';

// --- Pet Deletion Confirmation Modal ---
const PetConfirmationModal = ({ petName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-yellow-500 text-4xl" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-purple-900 mb-2">Confirm Removal</h2>
            <p className="text-gray-600 mb-6">
                Do you really want to remove the entry for <strong>{petName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={onCancel}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
                >
                    No, Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                    Yes, Remove
                </button>
            </div>
        </div>
    </div>
);

// --- 1. NEW User Deletion Confirmation Modal ---
const UserConfirmationModal = ({ userName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-yellow-500 text-4xl" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-purple-900 mb-2">Confirm Removal</h2>
            <p className="text-gray-600 mb-6">
                Do you really want to remove <strong>{userName}</strong> from the community? This will also remove all their pet listings.
            </p>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={onCancel}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
                >
                    No, Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                    Yes, Remove
                </button>
            </div>
        </div>
    </div>
);


// --- Reusable Pet Card Component ---
const PetCard = ({ pet, onCardClick }) => (
  <div 
    onClick={() => onCardClick(pet)}
    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
  >
    <div className="w-full h-56 bg-purple-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
      {pet.photo ? (
        <img 
          src={`http://localhost:3000/uploads/${pet.photo}`} 
          alt={pet.name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <FaPaw className="text-purple-300 text-8xl" />
      )}
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold text-purple-800">{pet.name}</h3>
      <p className="text-gray-600">{pet.breed}</p>
    </div>
  </div>
);

// --- Reusable User List Item for Admin ---
const UserListItem = ({ user, onRemoveClick }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
        <div>
            <p className="font-bold text-purple-900">{user.fullname}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center text-gray-500 mt-1 text-sm">
              <FaMapMarkerAlt className="mr-2" />
              <span>{user.city}, {user.state}</span>
            </div>
            <p className="text-sm text-green-600 font-semibold mt-1">{user.pets.length} pet listings</p>
        </div>
        <button className="text-red-500 hover:text-red-700" onClick={() => onRemoveClick(user)}>
            <FaTrash size={20} />
        </button>
    </div>
);


// --- Pet Detail Modal ---
const PetDetailModal = ({ pet, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                <FaTimes size={24} />
            </button>
            <div className="w-full h-56 bg-purple-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
              {pet.photo ? (
                <img 
                  src={`http://localhost:3000/uploads/${pet.photo}`} 
                  alt={pet.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaDog className="text-purple-300 text-8xl" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-purple-800 mb-4">{pet.name}</h2>
            <div className="space-y-2 text-gray-700">
                <p><strong>Species:</strong> {pet.species}</p>
                <p><strong>Breed:</strong> {pet.breed}</p>
                <p><strong>Color:</strong> {pet.color}</p>
                <p><strong>Weight:</strong> {pet.weight} kg</p>
                <p><strong>Gender:</strong> {pet.gender}</p>
                <p><strong>Nature:</strong> {pet.nature}</p>
            </div>
        </div>
    </div>
);

// --- Profile Dropdown Component ---
const ProfileMenu = ({ user, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleNavigate = (path) => {
      navigate(path)
    }

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="block w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                {user.profilepic ? (
                    <img src={`http://localhost:3000/uploads/${user.profilepic}`}
                    alt="Profile" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                        <FaUserCircle className="text-purple-400 text-5xl" />
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-50 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-bold text-purple-900">{user.fullname}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                        {user.role === 'user' && (
                            <>
                                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center rounded" onClick={() => handleNavigate('/putforadoption')}><FaPaw className="mr-3 text-purple-500" /> Put for Adoption</button>
                                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center rounded" onClick={() => handleNavigate('/browsepets')}><FaListAlt className="mr-3 text-purple-500" /> Browse All Pets</button>
                            </>
                        )}
                        <button onClick={() => navigate('/community')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center rounded"><FaUsers className="mr-3 text-purple-500" /> View Community Page</button>
                        <button onClick={() => navigate('/update-profile')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center rounded"><FaPen className="mr-3 text-purple-500" /> Update Profile</button>
                        <button onClick={() => handleNavigate('/')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 flex items-center rounded"><FaHome className="mr-3 text-purple-500" /> Home</button>
                    </div>
                    <div className="border-t border-gray-200 py-2">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"><FaSignOutAlt className="mr-3" /> Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [selectedPet, setSelectedPet] = useState(null);
  const { petList, setPetList } = useContext(PetContext);
  const [petToDelete, setPetToDelete] = useState(null);
  const [members, setMembers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null); // 2. NEW state for user deletion
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.role === 'admin') {
      //   try {
      //     const getCommunityMembers = async () => {
      //     const res = await fetch('api/community');
      //     const data = await res.json();
      //     setMembers(data.members);
      //   };
      // } catch (err) {
      //   setError("Some unexpected error occured.")
      // }
      //   getCommunityMembers();
      const getCommunityMembers = async () => {
        try {
          const res = await fetch('api/community');
          const data = await res.json();
          if(!res.ok){
            setError(data.message);
          }
          else{
            setMembers(data.members);
          }
        } catch (err) {
          setError("Some unexpected error occured.");
        }
      }
      getCommunityMembers()
    }
  }, [user]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/logout', { method: "POST" });
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError("Some unexpected error occured.")
    }
  };

  const handleRemovePetClick = (pet) => {
    setPetToDelete(pet);
  };

  const confirmRemovePet = async () => {
    if (!petToDelete) return;
    try {
      await fetch(`api/deletepet/${petToDelete._id}`, { method: 'DELETE' });
      setPetList(currentPets => currentPets.filter(p => p._id !== petToDelete._id));
      setPetToDelete(null);
    } catch (err) {
      setError("Some unexpected error occured.")
    }
  };

  // 3. NEW functions for handling user removal
  const handleRemoveUserClick = (member) => {
    setUserToDelete(member);
  };

  const confirmRemoveUser = async () => {
    if (!userToDelete) return;
    try {
      await fetch(`api/deleteuser/${userToDelete._id}`, { method: 'DELETE' });
    
      setMembers(currentMembers => currentMembers.filter(m => m._id !== userToDelete._id));
      setUserToDelete(null);
    } catch (err) {
      setError("Some unexpected error occured.")
    }
  };

  if(error){
    return <ErrorDisplay message={error}/>
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center p-4 bg-green-100 border border-green-300 rounded-lg'>
        <p className='text-lg font-semibold text-green-800 mr-3'>Loading Dashboard</p>
        <LoadingIcons.TailSpin stroke="#6B21A8" />
      </div>
    );
  }

  const { role } = user;

  const UserDashboard = () => (
    <>
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-900">My Pets for Adoption</h1>
        <ProfileMenu user={user} handleLogout={handleLogout} />
      </div>
      
      {petList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {petList.map(pet => (
            <div key={pet._id} className="flex flex-col">
              <PetCard pet={pet} onCardClick={setSelectedPet} />
              <div className="mt-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleRemovePetClick(pet);
                  }}
                  className="w-full flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  <FaTrash className="mr-2" />
                  Remove Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800">No pets listed yet!</h2>
          <p className="text-gray-600 mt-2">Use the profile menu to add your first pet for adoption.</p>
        </div>
      )}
    </>
  );

  const AdminDashboard = () => (
    <>
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-900">User Management</h1>
        <ProfileMenu user={user} handleLogout={handleLogout} />
      </div>
      <div className="space-y-4">
        {members.map(member => (
          <UserListItem key={member._id} user={member} onRemoveClick={handleRemoveUserClick} />
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-purple-50 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {role === 'user' ? <UserDashboard /> : <AdminDashboard />}
      </div>
      {selectedPet && <PetDetailModal pet={selectedPet} onClose={() => setSelectedPet(null)} />}

      {petToDelete && (
        <PetConfirmationModal
          petName={petToDelete.name}
          onConfirm={confirmRemovePet}
          onCancel={() => setPetToDelete(null)}
        />
      )}

      {/* 4. Conditionally render the NEW user confirmation modal */}
      {userToDelete && (
        <UserConfirmationModal
            userName={userToDelete.fullname}
            onConfirm={confirmRemoveUser}
            onCancel={() => setUserToDelete(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
