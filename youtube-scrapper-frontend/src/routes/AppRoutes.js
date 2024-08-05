//./routes/Routes.js

import React from 'react'
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Home from '../components/Home/Home.js';
import SearchComponent from '../components/SearchComponent/SearchComponent.js';
import SearchChannel from '../components/SearchChannel/SearchChannel.js';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchComponent />} />
                <Route path="/searchByChannel" element={<SearchChannel />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes