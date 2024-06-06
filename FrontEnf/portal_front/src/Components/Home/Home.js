import React, { useState } from "react";
// Importing Link from react-router-dom to 
// navigate to different end points.
import { useLocation ,Link } from "react-router-dom";
 import Header from '../Header/Header.js'
import Claimnew from "../Claimnew/Claimnew.js";

 const Home = () => {
    const location = useLocation();
    const {state} = location
    const [show ,setshow] =useState(true)
    return (
        <div>
            <h1>Home Page</h1>
            
           <h2>{state.username}</h2>
             <button onClick={e=> setshow(true)} >Claim new</button>
             {show && <Claimnew show ={show} setshow ={setshow} user ={state}/> }

        </div>
    );
};
 
export default Home;