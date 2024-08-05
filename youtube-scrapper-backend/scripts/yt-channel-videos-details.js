//./scripts/youtubeChannelVideos.js
import { ApifyClient } from 'apify-client';
import { videoDataUsingId } from './yt-video-data-using-videoid.js';
import dotenv from 'dotenv';
import { logError } from '../utils/logError.js';
import { appendToSheet } from '../services/google-sheet-service.js'; // Import appendToSheet
import { appendToSheetWithRetry } from '../utils/append-to-sheet-with-retry.js';

dotenv.config();
const API_TOKEN = process.env.APIFY_API_KEY_YOUTUBE_SCRAPPPER;

const client = new ApifyClient({
    token: API_TOKEN
});

export const runScraper = async (url) => {
    console.log("Function called: runScraper");
    const input = {
        startUrls: [
            {
                url: url
            }
        ],
        maxResults: 20,
        maxResultsShorts: 0,
        maxResultStreams: 0,
    };

    try {
        const run = await client.actor("streamers/youtube-scraper").call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        const channelDescription = items[0].channelDescription;
        const sortedItems = items.sort((a, b) => b.viewCount - a.viewCount);
        let videoIds = sortedItems.map(item => item.id);
        const top10Items = sortedItems.slice(0, 10);
        const videoArray = [];
        const tagArray = [];
        const titles = [];
        let videoDetailsArray = [];

        const headers = [
            'Video ID', 'Video Title', 'ChannelName','Description', 'Published At',
            'View Count', 'Like Count', 'Comment Count', 'Tags'
        ];

        await appendToSheet('VideoDetails', headers);
        for (const videoId of videoIds) {
            try {
                const videoDetails = await videoDataUsingId(videoId);
                videoArray.push(videoDetails);
               
                videoDetailsArray.push([
                    videoDetails.videoId,
                    videoDetails.VideoTitle,
                    videoDetails.channelTitle,
                    videoDetails.description,
                    videoDetails.uploadDate,
                    videoDetails.numberOfViews,
                    videoDetails.numberOfLikes,
                    videoDetails.numberOfComments,
                    videoDetails.tags ? videoDetails.tags.join(', ') : ''
                ]);
            } catch (error) {
                logError(error, 'runScraper - videoDataUsingId');
            }
        }

        for (const videoDetail of videoDetailsArray) {
            await appendToSheetWithRetry('VideoDetails', videoDetail);
        }

        videoIds = top10Items.map(item => item.id);
        // Process each video ID
        for (const videoId of videoIds) {
            try {
                const videoDetails = await videoDataUsingId(videoId);
                titles.push(videoDetails.VideoTitle);

                if (videoDetails.tags) {
                    tagArray.push(...videoDetails.tags);
                }
            } catch (error) {
                logError(error, 'runScraper - videoDataUsingId');
            }
        }
        console.log("Tag array size is,", tagArray.length);

        console.log("Title array size is,", titles.length);

        
        return { tagArray, channelDescription, titles };

    } catch (error) {
        logError(error, 'runScraper');
        throw error;
    }
};





// //./scripts/youtubeChannelVideos.js
// import { ApifyClient } from 'apify-client';
// import { videoDataUsingId } from './videoDataUsingId.js';
// import dotenv from 'dotenv';
// import { logError } from '../utils/logError.js';
// import { appendToSheet } from '../services/googleSheetsService.js'; // Import appendToSheet

// dotenv.config();
// const API_TOKEN = process.env.APIFY_API_KEY_YOUTUBE_SCRAPPPER;

// const client = new ApifyClient({
//     token: API_TOKEN
// });

// export const runScraper = async (url) => {
//     console.log("Function called: runScraper");
//     const input = {
//         startUrls: [
//             {
//                 url: url
//             }
//         ],
//         maxResults: 200,
//         maxResultsShorts: 0,
//         maxResultStreams: 0,
//     };

//     try {
//         const run = await client.actor("streamers/youtube-scraper").call(input);
//         const { items } = await client.dataset(run.defaultDatasetId).listItems();
//         const channelDescription = items[0].channelDescription;
//         const sortedItems = items.sort((a, b) => b.viewCount - a.viewCount);
//         const top10Items = sortedItems.slice(0, 2);
//         const videoIds = top10Items.map(item => item.id);
//         const videoArray = [];
//         const tagArray = [];
//         const titles = [];
//         const videoDetailsArray = [];

//         const headers = [
//             'Video ID', 'Video Title', 'ChannelName','Description', 'Published At',
//             'View Count', 'Like Count', 'Comment Count', 'Tags'
//         ];

//         await appendToSheet('VideoDetails', headers);

//         // Process each video ID
//         for (const videoId of videoIds) {
//             try {
//                 const videoDetails = await videoDataUsingId(videoId);
//                 videoArray.push(videoDetails);
//                 titles.push(videoDetails.VideoTitle);

//                 videoDetailsArray.push([
//                     videoDetails.videoId,
//                     videoDetails.VideoTitle,
//                     videoDetails.channelTitle,
//                     videoDetails.description,
//                     videoDetails.uploadDate,
//                     videoDetails.numberOfViews,
//                     videoDetails.numberOfLikes,
//                     videoDetails.numberOfComments,
//                     videoDetails.tags ? videoDetails.tags.join(', ') : ''
//                 ]);

//                 if (videoDetails.tags) {
//                     tagArray.push(...videoDetails.tags);
//                 }
//             } catch (error) {
//                 logError(error, 'runScraper - videoDataUsingId');
//             }
//         }
//         console.log("Title array size is,", titles.length);

//         for (const videoDetail of videoDetailsArray) {
//             await appendToSheet('VideoDetails', videoDetail);
//         }

//         return { tagArray, channelDescription, titles, videoDetailsArray };

//     } catch (error) {
//         logError(error, 'runScraper');
//         throw error;
//     }
// };
