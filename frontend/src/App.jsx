import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, NavLink } from 'react-router-dom'
import LandingPage from './Component/LandingPage'
import Register from './Component/Register'
import Login from './Component/Login'
import Dashboard from './Component/Dashboard'
import BrowsePets from './Component/BrowsePets'
import PutForAdoption from './Component/PutForAdoption'
import Community from './Component/Community'
import UpdateProfile from './Component/UpdateProfile'
import ErrorDisplay from './Component/ErrorDisplay'
import PageNotFound from './Component/PageNotFound'
import ProtectedRoutes from './Context/ProtectedRoutes'
import ProtectFromAuthenticatedUsers from './Context/ProtectFromAuthenticatedUsers'
import ProtectFromAdmin from './Context/ProtectFromAdmin'
import { UserProvider } from './Context/UserContext'
import { PetProvider } from './Context/PetContext'

function App() {

  return (
    <UserProvider>
      <PetProvider>
          <Routes>
            <Route path='/' element={<LandingPage/>}/>

            <Route path='/register' element={
              <ProtectFromAuthenticatedUsers>
                <Register/>
              </ProtectFromAuthenticatedUsers>
              }/>

            <Route path='/login' element={
              <ProtectFromAuthenticatedUsers>
                <Login/>
              </ProtectFromAuthenticatedUsers>
              }/>

            <Route path='/dashboard' element={
              <ProtectedRoutes>
                <Dashboard/>
              </ProtectedRoutes>
            }/>

            <Route path='/putforadoption' element={
              <ProtectedRoutes>
                <ProtectFromAdmin>
                  <PutForAdoption/>
                </ProtectFromAdmin>
              </ProtectedRoutes>
            }/>

            <Route path='/browsepets' element={
              <ProtectedRoutes>
                <ProtectFromAdmin>
                  <BrowsePets/>
                </ProtectFromAdmin>
              </ProtectedRoutes>
            }/>

            <Route path='/community' element={
              <ProtectedRoutes>
                <Community/>
              </ProtectedRoutes>
            }/>

            <Route path='/update-profile' element={
              <ProtectedRoutes>
                <UpdateProfile/>
              </ProtectedRoutes>
            }/>

            <Route path='/error-display' element={
              <ErrorDisplay/>
            }/>

            <Route path="*" element={
              <PageNotFound/>
            }/>
          </Routes>
        </PetProvider>
      </UserProvider> 
  )

}

export default App
