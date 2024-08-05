//tagOptimization.js

import { chatCompleteOpenAI } from '../services/open-ai-service.js';
import { logError } from '../utils/logError.js';

const processIndividualData = async (role, contextMessage, tagArray, description) => {
    console.log("Function called: processIndividualData");
    const messages = [
        {
            "role": "system",
            "content": contextMessage
        },
        {
            "role": role,
            "content": JSON.stringify({ tagArray, description })
        }
    ];

    return await chatCompleteOpenAI(messages);
};

export const tagOptimizer = async ({ query }) => {
    console.log("Function called: tagOptimizer");
    const { tagArray, description } = query;
    if (!tagArray) {
        throw new Error('TagArray query parameter is required');
    }

    try {
        const contextMessage = "You are an SEO optimization assistant tasked with keyword clustering for YouTube. TagArray consists of all the tags of all YouTube videos of a channel and the description is the description of that YouTube channel. Now extract only top 20 keywords from TagArray. If you think that there could be better tags possible in relevance to the channel then generate tags but at last return a total of 20 tags only so that future videos will consist of those tags and will get more views.";
        const result = await processIndividualData("user", contextMessage, tagArray, description);

        return result;

    } catch (error) {
        logError(error, 'tagOptimizer');
        throw new Error('Internal Server Error');
    }
};
