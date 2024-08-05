//FetchKeyworddata.js
import axios from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';
import Keyword from '../models/keywordModel.js';
import Channel from '../models/channelModel.js';
import Video from '../models/videoModel.js'


const searchYouTube = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send('Query parameter is required');
    }

    const currentData= await Keyword.findOne({keyword:query})

    if (currentData) {
       // console.log("currentData is present" )

        return res.status(200).json({
            videoIds: currentData.videoIds,
            channelIds: currentData.channelIds,
        });
    }

    console.log("currentData is not present" )


    try {
        const response = await axios.get('https://youtube.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                maxResults: 10,
                q: query,
                key: process.env.API_KEY,
            },
        });

        const items = response.data.items;
        const videos = items.filter((item) => item.id.kind === 'youtube#video');
        const channels = items.filter((item) => item.id.kind === 'youtube#channel');

        const keywordData = {
            keyword: query,
            videoIds: videos.map((video) => video.id.videoId),
            channelIds: channels.map((channel) => channel.id.channelId),
        };

        const keyword = new Keyword(keywordData);
        await keyword.save();

        videos.map(async (video) => {
            await getVideoDetails(video.id.videoId)
        })

        channels.map(async (channel) => await getChannelDetails(channel.id.channelId))
        const keywordDoc = await Keyword.findOne({ keyword: query });


        res.json({
            videoIds: keywordDoc.videoIds,
            channelIds: keywordDoc.channelIds,
        });
    } catch (error) {
        console.error("Error is ", error);
        res.status(500).send('Error fetching data from YouTube API');
    }
};



const getVideoDetails = async (videoIdValue) => {
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
            console.warn(`Warning: Transcript not available for video ID ${videoIdValue}:`, transcriptError.message);
        }

        let alltags = [];

        if (response.data.items[0].snippet.tags) {
            for (let i = 0; i < response.data.items[0].snippet.tags.length; i++) {
                alltags.push(response.data.items[0].snippet.tags[i]);
            }
        }

     //   console.log("Snippets are ",response.data.items[0].snippet)
     //   console.log("contentDetails  are ",response.data.items[0].snippet)
        

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

        const videoDetailsInstance = new Video(VideoDetailsInfo)
        await videoDetailsInstance.save()

    } catch (error) {
        console.error("Error is ", error.message);
    }
}


const getChannelDetails = async (channelId) => {

    try {
        const response = await axios.get('https://youtube.googleapis.com/youtube/v3/channels', {
            params: {
                part: 'snippet,contentDetails,statistics',
                id: channelId,
                key: process.env.API_KEY,
            },
            headers: {
                'Accept': 'application/json',
            },
        });
        const snippetValue = response.data.items[0].snippet
        const contentDetailsValue = response.data.items[0].contentDetails
        const statisticsValue = response.data.items[0].statistics

        const channelDataDetails = {
            channelName: snippetValue.title,
            description: snippetValue.description,
            numberOfSubscribers: statisticsValue.subscriberCount,
            totalNumberOfVideos: statisticsValue.videoCount,
            channelCreationDate: snippetValue.publishedAt,
            views: statisticsValue.viewCount,
            channelId: channelId
        }
        const channelDataCreated = new Channel(channelDataDetails);
        await channelDataCreated.save();
    } catch (error) {
        console.error("Error fetching data from YouTube API:", error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching data from YouTube API');
    }
}




export { searchYouTube, getVideoDetails, getChannelDetails };