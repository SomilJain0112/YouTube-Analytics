//SearchComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar.js';
import './SearchComponent.css'; // Add your CSS file for custom styling

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [videoDetails, setVideoDetails] = useState([]);
    const [channelDetails, setChannelDetails] = useState([]);
    const [error, setError] = useState('');
    const [expandedVideo, setExpandedVideo] = useState(null);
    const [expandedChannel, setExpandedChannel] = useState(null);

    const handleSearch = async () => {
        setResults(null);
        setVideoDetails([]);
        setChannelDetails([]);
        setError('');
        try {
            const response = await axios.get('http://localhost:9990/api/search', {
                params: { q: query },
            });

            setResults(response.data);
            setError('');
            setQuery('');
            await fetchDetails();
        } catch (err) {
            setError('Error fetching data using keyword. Please try again.');
            setResults(null);
        }
    };

    const fetchDetails = async () => {
        try {
            if (results) {
                let videoDetailsArray = [];
                let channelDetailsArray = [];

                for (let videoId of results.videoIds) {
                    try {
                        const videoResponse = await axios.get(`http://localhost:9990/api/videos/${videoId}`);
                        videoDetailsArray.push(videoResponse.data);
                    } catch (err) {
                        console.error("Error fetching video details:", err);
                    }
                }

                for (let channelId of results.channelIds) {
                    try {
                        const channelResponse = await axios.get(`http://localhost:9990/api/channels/${channelId}`);
                        channelDetailsArray.push(channelResponse.data);
                    } catch (err) {
                        console.error("Error fetching channel details:", err);
                    }
                }

                setVideoDetails(videoDetailsArray);
                setChannelDetails(channelDetailsArray);
            }
        } catch (error) {
            console.log("Error in fetchDetails function", error);
        }
    };

    const handleVideoClick = (videoId) => {
        setExpandedVideo(expandedVideo === videoId ? null : videoId);
    };

    const handleChannelClick = (channelId) => {
        setExpandedChannel(expandedChannel === channelId ? null : channelId);
    };

    useEffect(() => {
        if (results) {
            fetchDetails();
        }
    }, [results]);

    return (
        <>
            <Navbar />
            <div className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                />
                <button onClick={handleSearch}>Search</button>
                {error && <p className="error-message">{error}</p>}
                {results && (
                    <div>

                        <h3>Video Details:</h3>
                        {videoDetails.length > 0 ? (
                            videoDetails.map((video, index) => (
                                <div key={video.videoId} className="collapsible-item">
                                    <button
                                        className="collapsible-header"
                                        onClick={() => handleVideoClick(video.videoId)}
                                    >
                                        {index + 1}: <strong> Title:</strong> {video.VideoTitle}
                                    </button>
                                    {expandedVideo === video.videoId && (
                                        <div className="collapsible-content">
                                            <p><strong>Channel Title:</strong> {video.channelTitle}</p>
                                            <p><strong>Description:</strong> {video.description}</p>
                                            <p><strong>Views:</strong> {video.numberOfViews}</p>
                                            <p><strong>Likes:</strong> {video.numberOfLikes}</p>
                                            <p><strong>Comments:</strong> {video.numberOfComments}</p>
                                            <p><strong>Upload Date:</strong> {new Date(video.uploadDate).toLocaleDateString()}</p>
                                            <p><strong>Tags:</strong> {video.tags.join(', ')}</p>
                                            <p><strong>Transcript:</strong> {video.transcript}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No video details available.</p>
                        )}

                        <h3>Channel Details:</h3>
                        {channelDetails.length > 0 ? (
                            channelDetails.map((channel, index) => (
                                <div key={channel.channelId} className="collapsible-item">
                                    <button
                                        className="collapsible-header"
                                        onClick={() => handleChannelClick(channel.channelId)}
                                    >
                                        {index + 1}: {channel.channelName}
                                    </button>
                                    {expandedChannel === channel.channelId && (
                                        <div className="collapsible-content">
                                            <p><strong>Description:</strong> {channel.description}</p>
                                            <p><strong>Subscribers:</strong> {channel.numberOfSubscribers}</p>
                                            <p><strong>Total Videos:</strong> {channel.totalNumberOfVideos}</p>
                                            <p><strong>Channel Creation Date:</strong> {new Date(channel.channelCreationDate).toLocaleDateString()}</p>
                                            <p><strong>Views:</strong> {channel.views}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No channel details available.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchComponent;
