import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompleteList.css'; // Add your CSS file for custom styling

const CompleteList = () => {
  const [data, setData] = useState({
    keywords: [],
    channels: [],
    videos: []
  });
  const [expandedKeyword, setExpandedKeyword] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [expandedChannel, setExpandedChannel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9990/api/SearchList');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleKeywordClick = (keywordId) => {
    setExpandedKeyword(expandedKeyword === keywordId ? null : keywordId);
  };

  const handleVideoClick = (videoId) => {
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  const handleChannelClick = (channelId) => {
    setExpandedChannel(expandedChannel === channelId ? null : channelId);
  };

  return (
    <div className="complete-list-container">
      <h1>Keywords List</h1>
      {data.keywords.map((keyword, index) => (
        <div key={keyword.keywordId} className="collapsible-item">
          <button
            className="collapsible-header"
            onClick={() => handleKeywordClick(keyword.keywordId)}
          >
            {index + 1}. {keyword.keyword}
          </button>
          {expandedKeyword === keyword.keywordId && (
            <div className="collapsible-content">
              <h4>Keyword Details</h4>
              <p><strong>Keyword ID:</strong> {keyword.keywordId}</p>
              <p><strong>Video IDs:</strong> {keyword.videoIds.join(', ')}</p>
              <p><strong>Channel IDs:</strong> {keyword.channelIds.join(', ')}</p>

              <h4>Videos</h4>
              {data.videos
                .filter(video => keyword.videoIds.includes(video.videoId))
                .map((video, videoIndex) => (
                  <div key={video.videoId} className="collapsible-item">
                    <button
                      className="collapsible-header"
                      onClick={() => handleVideoClick(video.videoId)}
                    >
                      {videoIndex + 1}. {video.VideoTitle}
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
                ))}

              <h4>Channels</h4>
              {data.channels
                .filter(channel => keyword.channelIds.includes(channel.channelId))
                .map((channel, channelIndex) => (
                  <div key={channel.channelId} className="collapsible-item">
                    <button
                      className="collapsible-header"
                      onClick={() => handleChannelClick(channel.channelId)}
                    >
                      {channelIndex + 1}. {channel.channelName}
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
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CompleteList;
