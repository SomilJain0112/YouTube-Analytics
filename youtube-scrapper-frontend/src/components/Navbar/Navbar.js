// Navbar.js
import React from 'react';
import './Navbar.css';

import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" style={{color:"white"}}>
                Youtube Scrapper
                </Link>
                </div>
            <ul className="navbar-links">
                <li><Link to="/search" style={{ fontSize: "25px" }} >Search</Link></li>
                <li><Link to="/searchByChannel" style={{ fontSize: "25px" }} >Channel</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
