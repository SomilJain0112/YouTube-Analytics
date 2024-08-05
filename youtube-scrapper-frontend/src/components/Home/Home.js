
// HomePage.js
import React from 'react';
import './Home.css';
import SearchComponent from '../SearchComponent/SearchComponent';
import Navbar from '../Navbar/Navbar';
import CompleteList from '../CompleteList/CompleteList';

const Home = () => {
    return (
        <div className="home-page">
            <Navbar />
            <div className="content">
                <CompleteList/>
                
            </div>
        </div>
    );
};

export default Home;
