//ByChannelNameController.js
import { tagOptimizer } from "../scripts/tag-optimizer.js";
import { titleOptimizer } from "../scripts/title-optimizer.js";
import { runScraper } from "../scripts/yt-channel-videos-details.js";
import { logError } from '../utils/logError.js'; 
import { appendToSheetWithRetry } from "../utils/append-to-sheet-with-retry.js";
import { delay } from "../utils/delay.js";

export const ByChannelNameController = async (req, res) => {
    console.log("Function called: ByChannelNameController");
    try {
        const { channelName } = req.body;
        const { titles, tagArray, channelDescription } = await runScraper(channelName);
        const optimizedTags = await tagOptimizer({ query: { tagArray, channelDescription } });
        await appendToSheetWithRetry("TagOptimization", ["ChannelDescription", "Old Tags List", "Optimized Tags"]);
        await appendToSheetWithRetry("TagOptimization", [channelDescription, tagArray.join(', '), optimizedTags]);

        await appendToSheetWithRetry("Optimized-Titles", ["title", "optimizedTitle"]);
        const optimizedTitles = [];
        let cnt = 1;

        for (const title of titles) {
            try {
                await delay(30000); // Delay for 30 seconds
                const optimizedTitle = await titleOptimizer({ title, optimizedTags, channelDescription });
                optimizedTitles.push({ optimizedTitle });

                console.log(cnt, "Old title -> ", title);
                console.log(cnt, "New title -> ", optimizedTitle);

                await appendToSheetWithRetry("Optimized-Titles", [title, optimizedTitle]);
            } catch (error) {
                logError(error, "titleOptimizer");
                console.log(`Error processing title ${title}. Retrying in 1 minute...`);
                await delay(65000); // Delay for 1 minute

                try {
                    const optimizedTitle = await titleOptimizer({ title, optimizedTags, channelDescription });
                    optimizedTitles.push({ optimizedTitle });

                    await appendToSheetWithRetry("Optimized-Titles", [title, optimizedTitle]);
                } catch (retryError) {
                    logError(retryError, "titleOptimizerRetry");
                }
            }
            cnt++;
        }

        res.status(200).json("message Perfect");

    } catch (error) {
        logError(error, 'ByChannelNameController');
        res.status(500).json({ message: 'Failed to fetch channel details' });
    }
};
