// filename -App.js

import React from "react";
import "./App.css";
import Header from "./Components/Header/Header.js";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import AdminHome from "./Pages/Home/AdminHome";
import Home from "./Components/Home/Home.js"
import ManagerHome from "./Pages/Home/ManagerHome";
import EmployeeHome from "./Pages/Home/EmployeeHome";
// import About from "./pages/about";
// import Events from "./pages/events";
// import AnnualReport from "./pages/annual";
// import Teams from "./pages/team";
// import Blogs from "./pages/blogs";
// import SignUp from "./pages/signup";
import Register from './Pages/Register/Register.js'
import Login from './Pages/Login/Login.js'
function App() {
    return (
        <Router>
            {/* <Navbar /> */}
            <Routes>
                <Route path="/"  element ={<Login/>} />
                <Route path="/Home" element={<Home />} />
                <Route path="/ManagerHome" element={<ManagerHome />} />
                <Route path="/EmployeeHome" element={<EmployeeHome />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/AdminHome" element={<AdminHome />} />
                {/* <Route
                    path="/events"
                    element={<Events />}
                />
                <Route
                    path="/annual"
                    element={<AnnualReport />}
                />
                <Route path="/team" element={<Teams />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route
                    path="/sign-up"
                    element={<SignUp />}
                /> */}
            </Routes>
        </Router>
    );
}

export default App;
