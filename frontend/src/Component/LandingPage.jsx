import React from "react";
import Navbar from "./Navbar";
import Body from "./Body";
import Footer from "./Footer";

const LandingPage = () =>{
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar/>
            <Body />
            <Footer />
        </div>
    )
}

export default LandingPage;