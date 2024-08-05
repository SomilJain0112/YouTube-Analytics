import axios from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';
import { logError } from '../utils/logError.js';

export const videoDataUsingId = async (videoIdValue) => {
    console.log("Function called: videoDataUsingId");
    try {
        const response = await axios.get('https://youtube.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,contentDetails,statistics,liveStreamingDetails,localizations,player,recordingDetails,topicDetails',
                id: videoIdValue,
                key: process.env.API_KEY,
            },
            headers: {
                'Accept': 'application/json',
            }
        });

        let concatenatedText = '';
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(videoIdValue);
            concatenatedText = transcript.map(item => item.text).join(' ');
        } catch (transcriptError) {
            if (transcriptError.message.includes('Transcript is disabled')) {
                concatenatedText = 'Transcript is disabled for this video';
                console.warn(`Transcript is disabled for video ID: ${videoIdValue}`);
            } else {
                logError(transcriptError, 'videoDataUsingId - Transcript Fetch');
                throw transcriptError;
            }
        }

        let alltags = [];

        if (response.data.items[0].snippet.tags) {
            alltags = response.data.items[0].snippet.tags;
        }

        const VideoDetailsInfo = {
            VideoTitle: response.data.items[0].snippet.title,
            videoId: videoIdValue,
            channelTitle: response.data.items[0].snippet.channelTitle,
            channelId: response.data.items[0].snippet.channelId,
            description: response.data.items[0].snippet.description,
            numberOfViews: response.data.items[0].statistics.viewCount,
            numberOfLikes: response.data.items[0].statistics.likeCount,
            numberOfComments: response.data.items[0].statistics.commentCount,
            uploadDate: response.data.items[0].snippet.publishedAt,
            tags: alltags,
            transcript: concatenatedText,
        }

        return VideoDetailsInfo;

    } catch (error) {
        logError(error, 'videoDataUsingId');
        throw error;
    }
};
