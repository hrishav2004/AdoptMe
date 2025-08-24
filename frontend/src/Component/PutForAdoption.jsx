import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiPawPrintFill } from 'react-icons/pi';
import { FaCamera } from 'react-icons/fa';
import { UserContext } from '../Context/UserContext';

const PutForAdoption = () => {
  const navigate = useNavigate();
  const [petPhoto, setPetPhoto] = useState(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState('');
  const [error, setError] = useState('');

  const { user } = useContext(UserContext)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetPhoto(file);
      setPetPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);  
    const data = Object.fromEntries(formData.entries());

    if (data.weight <= 0) {
        setError('Weight must be a positive number.');
        return;
    }

    if(!petPhoto) {
        setError('Please upload a photo of your pet.')
        return;
    }
    setError('');

    // Append the owner id
    formData.append('owner', user._id);

    const res = await fetch('api/uploadpet', {
        method: 'POST',
        body: formData
    })
    navigate('/dashboard')
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center pt-24 pb-12 px-4">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 py-10">
          <div className="flex justify-center mb-8">
            <div className="flex items-center text-purple-700 font-bold text-3xl">
              <PiPawPrintFill className="text-yellow-400" />
              <span className="mx-2">List Your Pet</span>
              <PiPawPrintFill className="text-yellow-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="text-slate-900 space-y-6" encType='multipart/form-data'>
            {/* Pet Photo Upload */}
            <div className="flex flex-col items-center">
              <label htmlFor="petPhoto" className="cursor-pointer">
                <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-purple-300">
                  {petPhotoPreview ? (
                    <img src={petPhotoPreview} alt="Pet" className="w-full h-full rounded-full object-cover" required/>
                  ) : (
                    <FaCamera className="text-purple-400 text-4xl" />
                  )}
                </div>
              </label>
              <input type="file" id="petPhoto" name="photo" className="hidden" accept="image/*" onChange={handlePhotoChange}/>
              <p className="text-sm text-gray-500 mt-2">Upload Pet's Photo*</p>
            </div>

            {/* Pet Details */}
            <input type="text" name="name" placeholder="Pet's Name*" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            
            <select name="species" defaultValue={""} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
              <option value="" disabled>Select Species*</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Parrot">Parrot</option>
              <option value="Hamster">Hamster</option>
              <option value="Other">Other</option>
            </select>

            <input type="text" name="breed" placeholder="Breed*" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="text" name="color" placeholder="Color*" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            
            <input type="number" name="weight" placeholder="Weight (in kg)*" required min="0.1" step="0.1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

            <select name="gender" defaultValue={""} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
              <option value="" disabled>Select Gender*</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select name="nature" defaultValue={""} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
              <option value="" disabled>Select Nature*</option>
              <option value="Playful">Playful</option>
              <option value="Calm">Calm</option>
              <option value="Shy">Shy</option>
              <option value="Energetic">Energetic</option>
              <option value="Affectionate">Affectionate</option>
            </select>

            <textarea className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white'
            name='description' placeholder='What would a new family love most about them? (Maximum 500 characters)' rows={3}></textarea>

            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition">
              List for Adoption
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PutForAdoption;
