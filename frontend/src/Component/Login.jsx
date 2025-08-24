import React from 'react';
import { PiPawPrintFill } from 'react-icons/pi';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import LoadingIcons from 'react-loading-icons'

const Login = () => {
  const [ loginData, setLoginData ] = useState({
    email: '',
    password: ''
  })
  const [ error, setError ] = useState(null)
  const [ popup, setPopup ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  const navigate = useNavigate()

  const { setUser } = useContext(UserContext)

  useEffect(() => {
    if(popup){
      alert(popup)
      setPopup(null)
    }
  }, [popup])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    
    const data = {
      email: e.target.email.value,
      password: e.target.password.value
    }
    setLoginData(data)
    try{
      const res = await fetch('https://adoptme-bk01.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if(!res.ok){
        const err = result.message || "An error occured"
        setError(err)
        setPopup(err)
      }
      else{
        setError(null)
        setLoginData('')
        setLoading(true)
        e.target.reset()
        setUser(result.user)
        setTimeout(() => {
          setLoading(false)
          navigate('/dashboard')
        }, 1000)
      }
    } catch(err) {
        setError("An error occured while trying to login.")
        setPopup("An error occured while trying to login.")
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4">
      {loading && 
        <div className='flex items-center justify-center p-4 bg-green-100 border border-green-300 rounded-lg'>
          <p className='text-lg font-semibold text-green-800 mr-3'>Logging you in</p>
          <LoadingIcons.TailSpin stroke="#6B21A8" />
        </div>}
      {!loading && 
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 py-12">
          <div className="flex justify-center mb-8">
            <div className="flex items-center text-purple-700 font-bold text-3xl">
              <PiPawPrintFill className="text-yellow-400" />
              <span className="mx-2">Welcome Back</span>
              <PiPawPrintFill className="text-yellow-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-slate-900">
            <input
              type="email"
              placeholder="Email Address*"
              name='email'
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Password*"
              name='password'
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Login
            </button>
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="/register" className="font-semibold text-purple-600 hover:underline">
                Register here
              </a>
            </p>
            {error && <p className='text-red-500'>{error}</p>}
          </form>
        </div>
      </div>
    }
    </div>
  );
};

export default Login;
