import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import "./SearchChannel.css"

const SearchChannel = () => {
    const [url, setUrl] = useState('');
    const [channelName, setChannelName] = useState('');

    const handleInputChange = (e) => {
        setUrl(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = url
        if (name) {
            setChannelName(url);
            try {
                const response = await axios.post('http://localhost:9990/api/ByChannelName', { channelName: name });
                console.log('Response from backend:', response.data);
            } catch (error) {
                console.error('Error sending channel name to backend:', error);
            }
        } else {
            console.error('Invalid YouTube channel URL');
        }
    };

    return (
        <div>
            <Navbar/>
            <div className='channel-search-container'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={url}
                        onChange={handleInputChange}
                        placeholder="Enter YouTube Channel URL"
                    />
                    <button type="submit">Submit</button>
                </form>
                {channelName && <p>Extracted Channel Name: {channelName}</p>}

            </div>

        </div>
    );
};

export default SearchChannel;
