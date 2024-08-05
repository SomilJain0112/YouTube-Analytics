import Keyword from '../models/keywordModel.js';
import Channel from '../models/channelModel.js';
import Video from '../models/videoModel.js';
import axios from 'axios';

import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = 'https://api.openai.com/v1/chat/completions';

const chatCompleteOpenAI = async (messages, model = 'gpt-4') => {
    try {
        const response = await axios.post(baseURL, {
            model: model,
            messages: messages,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const processIndividualData = async (dataItem, role, contextMessage,keyword) => {
    const messages = [
        {
            "role": "system",
            "content": contextMessage
        },
        {
            "role": role,
            "content": JSON.stringify({dataItem,keyword})
        }
    ];

    return await chatCompleteOpenAI(messages);
};

export const chatassistantfunc = async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).send('Keyword query parameter is required');
    }

    try {
        const contextMessage = "You are an SEO optimization assistant tasked with keyword clustering for YouTube. Analyze the descriptions, transcripts, and tags of the channels and videos provided in relevance to keyword. Cluster keywords based on their relevance and frequency within these sources. Provide insights and clustering suggestions. Clustering should be done in context of keyword that is sent by the user";

        // Fetching channels
        const channels = await Channel.find({}, {
            channelName: 1,
            description: 1,
            numberOfSubscribers: 1,
            totalNumberOfVideos: 1,
            channelCreationDate: 1,
            views: 1
        });

        // Fetching videos
        const videos = await Video.find({}, {
            VideoTitle: 1,
            videoId: 1,
            channelTitle: 1,
            channelId: 1,
            description: 1,
            numberOfViews: 1,
            numberOfLikes: 1,
            numberOfComments: 1,
            uploadDate: 1,
            tags: 1,
            transcript: 1
        });

        const results = [];


        for (const channel of channels) {
            const result = await processIndividualData(channel, "user", contextMessage,keyword);
            results.push(result);
        }

        for (const video of videos) {
            const result = await processIndividualData(video, "user", contextMessage,keyword);
            results.push(result);
        }
      //  console.log("result array is ",results )

        res.status(200).json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
