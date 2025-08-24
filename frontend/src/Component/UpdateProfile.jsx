import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext'; // Or your useAuth hook
import { PiPawPrintFill } from 'react-icons/pi';
import { FaCamera, FaTrash, FaUndo } from 'react-icons/fa';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext); // Assuming context can update user
    
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        contact: '',
        locality: '',
        city: '',
        pincode: '',
        state: '',
        country: '',
    });
    const [profilePicFile, setProfilePicFile] = useState(null); // Holds the new file object
    const [profilePicPreview, setProfilePicPreview] = useState('');
    // State to track the photo action: 'keep', 'remove', or 'change'
    const [photoAction, setPhotoAction] = useState('keep');
    const [error, setError] = useState(null)

    // Pre-fill the form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || '',
                email: user.email || '',
                contact: user.contact || '',
                locality: user.locality || '',
                city: user.city || '',
                pincode: user.pincode || '',
                state: user.state || '',
                country: user.country || '',
            });
            if (user.profilepic) {
                setProfilePicPreview(`http://localhost:3000/uploads/${user.profilepic}`);
            }
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            setProfilePicPreview(URL.createObjectURL(file));
            setPhotoAction('change'); // Set action to 'change'
        }
    };

    const handleRemoveProfilePic = () => {
        setProfilePicFile(null);
        setProfilePicPreview('');
        setPhotoAction('remove'); // Set action to 'remove'
    };
    
    const handleUndoRemove = () => {
        // Revert to the original photo from the user context
        if (user && user.profilepic) {
            setProfilePicPreview(`http://localhost:3000/uploads/${user.profilepic}`);
        }
        setPhotoAction('keep'); // Revert action to 'keep'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        // Append the id of the current user
        submissionData.append('_id', user._id)
        // Append all text fields
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }
        
        // Append the photo action and file based on the state
        submissionData.append('photoAction', photoAction);
        if (photoAction === 'change' && profilePicFile) {
            submissionData.append('profilepic', profilePicFile);
        }

        try {
            const res = await fetch ('https://adoptme-bk01.onrender.com/api/update-profile', {
                method: 'PUT',
                body: submissionData,
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser.user); // Update context
                alert("Profile updated successfully!");
                navigate('/dashboard');
            } else {
                const getError = await res.json()
                const err = getError.message || "An error occured."
                setError(err)
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Some unexpected error occured.")
        }
    };

    if (!user) return <div>Loading profile...</div>;

    return (
        <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center pt-24 pb-12 px-4">
            <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-10">
                    <div className="flex justify-center mb-8">
                        <div className="flex justify-center items-center text-purple-700 font-bold text-3xl text-center">
                            <PiPawPrintFill className="text-yellow-400" />
                            <span className="mx-2">Update Your Profile</span>
                            <PiPawPrintFill className="text-yellow-400" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="text-slate-800 space-y-6">
                        <div className="flex flex-col items-center mb-6">
                            <label htmlFor="profilePicInput" className="cursor-pointer">
                                <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-purple-300">
                                    {profilePicPreview ? (
                                        <img src={profilePicPreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <FaCamera className="text-purple-400 text-4xl" />
                                    )}
                                </div>
                            </label>
                            <input type="file" id="profilePicInput" name='profilepic' className="hidden" accept="image/*" onChange={handleProfilePicChange} />
                            <p className="text-sm text-gray-500 mt-2">Upload a New Avatar</p>
                            
                            {/* Conditional buttons for removing or undoing removal */}
                            {photoAction !== 'remove' && profilePicPreview && (
                                <button type="button" onClick={handleRemoveProfilePic} className="mt-3 text-sm text-red-600 hover:underline flex items-center">
                                    <FaTrash className="mr-1" /> Remove Photo
                                </button>
                            )}
                             {photoAction === 'remove' && (
                                <button type="button" onClick={handleUndoRemove} className="mt-3 text-sm text-blue-600 hover:underline flex items-center">
                                    <FaUndo className="mr-1" /> Undo Remove
                                </button>
                            )}
                        </div>
                        
                        <input type="text" name="fullname" placeholder="Full Name*" required value={formData.fullname} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                        <input type="email" name="email" placeholder="Email Address*" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                        <input type="tel" name="contact" placeholder="Mobile Number*" required value={formData.contact} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />

                        {user.role === 'user' && (
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-600">Your Address</h3>
                                <input type="text" name="locality" placeholder="Locality*" required value={formData.locality} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" name="city" placeholder="City*" required value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                                    <input type="text" name="pincode" placeholder="Pincode*" required value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" name="state" placeholder="State*" required value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                                    <input type="text" name="country" placeholder="Country*" required value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition">
                            Save Changes
                        </button>
                        {error && <p className='text-red-500'>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;
