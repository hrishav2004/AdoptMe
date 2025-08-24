import React, { useEffect, useState, useContext } from 'react';
import { PiPawPrintFill } from 'react-icons/pi';
import { FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../Context/UserContext';

const Register = () => {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext)

  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    locality: '',
    city: '',
    pincode: '',
    state: '',
    country: '',
    role: ''
  });
  const [adminData, setAdminData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    role: ''
  })
  const [error, setError] = useState('')
  const [popup, setPopup] = useState(null)

  useEffect(() => {
    if(popup){
      alert(popup)
      setPopup(null)
    }
  }, [popup])

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError('Passwords do not match!');
    }
    else if (e.target.value.length < 6) {
      setPasswordError('Password must be at least 6 characters long.')
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password.length < 6){
      setPasswordError('Password must be at least 6 characters long.')
    }
    else if (password !== e.target.value) {
      setPasswordError('Passwords do not match!');
    } else {
      setPasswordError('');
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match!');
      return;
    }
    if (password.length < 6){
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (e.target.contact.value.length != 10) {
      setError("Mobile number must have 10 digits!")
      return;
    }
    // Handle form submission logic here
    const formData = new FormData(e.target);
    formData.append('role', role)
    // Register as user
    if(role == 'user'){
      setUserData(formData)
      try{  
          const res = await fetch('api/register/user', {
          method: 'POST',
          body: formData
          })
          const result = await res.json()
          if(!res.ok){
            const err = result.message || "An error occured."
            setError(err)
            setPopup(err)
          }
          else{
            setPopup(result.message)
            setError(null)
            setUser(result.user)
            setUserData('')
            e.target.reset()
            setTimeout(()=>{
              navigate('/dashboard')
            }, 1000)
          }
      } catch(err) {
        setError('An error occured while creating account, please try again later.')
        setPopup(error)
      }
    }

    // Register as admin
    else{
        formData.role = 'admin'
        setAdminData(formData)
        try{
          const res = await fetch ('api/register/admin', {
            method: 'POST',
            body: formData
          })
          const result = await res.json()
          if(!res.ok){
            const err = result.message || "An error occured."
            setError(err)
            setPopup(err)
          }
          else{
            setPopup(result.message)
            setUser(result.user)
            setUserData('')
            e.target.reset()
            setTimeout(()=>{
              navigate('/dashboard')
            }, 1000)
          }
        } catch(err) {
            console.error("Some error occured while registering: ", err)
            setError('An error occured while creating account, please try again later.')
            setPopup(error)
        }
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center pt-24 pb-12 px-4">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 py-10">
          <div className="flex justify-center mb-6">
            <div className="flex items-center text-purple-700 font-bold text-3xl">
              <PiPawPrintFill className="text-yellow-400" />
              <span className="mx-2">Join AdoptMe</span>
              <PiPawPrintFill className="text-yellow-400" />
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex justify-center mb-8 bg-purple-100 rounded-full p-1">
            <button
              onClick={() => setRole('user')}
              className={`w-1/2 py-2 rounded-full font-semibold transition ${
                role === 'user' ? 'bg-purple-600 text-white' : 'text-purple-600'
              }`}
            >
              I want to Adopt
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`w-1/2 py-2 rounded-full font-semibold transition ${
                role === 'admin' ? 'bg-purple-600 text-white' : 'text-purple-600'
              }`}
            >
              I am an Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-slate-900" encType='multipart/form-data'>
            {/* Common Fields */}
            <div className="flex flex-col items-center mb-6">
              <label htmlFor="profilePic" className="cursor-pointer">
                <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-purple-300">
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <FaCamera className="text-purple-400 text-3xl" />
                  )}
                </div>
              </label>
              <input type="file" id="profilePic" name='profilepic' className="hidden" accept="image/*" onChange={handleProfilePicChange} />
              <p className="text-sm text-gray-500 mt-2">Upload Profile Picture</p>
            </div>
            
            <input type="text" placeholder="Full Name*" name='fullname' required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="email" placeholder="Email Address*" name='email' required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="number" placeholder="Mobile Number*" name='contact' required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="password" placeholder="Password*" name='password' required value={password} onChange={handlePasswordChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="password" placeholder="Re-enter Password*" required value={confirmPassword} onChange={handleConfirmPasswordChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

            {/* User Specific Fields */}
            {role === 'user' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-600">Your Address</h3>
                <input type="text" placeholder="Locality*" name='locality' required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City*" name='city' required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <input type="text" placeholder="Pincode*" name='pincode' required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="State*" name='state' required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <input type="text" placeholder="Country*" name='country' required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            )}

            {/* Admin Specific Field */}
            {role === 'admin' && (
              <div className="pt-4 border-t border-gray-200">
                <input type="password" placeholder="Admin Secret Code*" name='code' required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            )}

            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition">
              Create Account
            </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-purple-600 hover:underline">
                Login here
              </a>
            </p>
            {error && <p className='text-red-500'>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;