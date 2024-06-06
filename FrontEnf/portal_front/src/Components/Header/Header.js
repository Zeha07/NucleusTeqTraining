import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/nucleusteq_logo.jpg';
import './Header.css';

const Header = ({ name }) => {
  let navigate = useNavigate();

  const logout = () => {
    navigate('/');
  }

  return (
    <div className="header-container">
      <div className="header-block">
        <div className="logo">
          <img src={logo} alt="Nucleusteq Logo" className="logo-pic" />
        </div>
        <div className="username">
          <span>{name}</span>
        </div>
        <div className="logout">
          <button className="button logout-button" onClick={logout}>
            <span className="button__text">Logout</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
