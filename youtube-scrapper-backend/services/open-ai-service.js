

import dotenv from 'dotenv';
import { logError } from '../utils/logError.js';
import axios from 'axios';

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;
const baseURL = 'https://api.openai.com/v1/chat/completions';


export const chatCompleteOpenAI = async (messages, model = 'gpt-4') => {
    console.log("Function called: chatCompleteOpenAI");
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
        logError(error, 'chatCompleteOpenAI');
        throw error;
    }
};