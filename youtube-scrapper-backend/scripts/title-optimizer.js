
import { chatCompleteOpenAI } from '../services/open-ai-service.js';
import { logError } from '../utils/logError.js';

const processTitleData = async (role, contextMessage, title, optimizedTags, channelDescription) => {
    const messages = [
        {
            "role": "system",
            "content": contextMessage
        },
        {
            "role": role,
            "content": JSON.stringify({ title, optimizedTags, channelDescription })
        }
    ];

    return await chatCompleteOpenAI(messages);
};

export const titleOptimizer = async ({ title, optimizedTags, channelDescription }) => {
    console.log("Function called: titleOptimizer");
    if (!title || !optimizedTags || !channelDescription) {
        throw new Error('Title, optimizedTags, and channelDescription parameters are required');
    }

    try {
        const contextMessage = "You are an SEO optimization assistant. You have been given a title, keywords, and a channel description as input from the user. Generate a better title for the given title to increase the number of views, taking into account the optimized tags and channel description.";
        const result = await processTitleData("user", contextMessage, title, optimizedTags, channelDescription);

        return result;

    } catch (error) {
        logError(error, 'titleOptimizer');
        throw new Error('Internal Server Error');
    }
};

