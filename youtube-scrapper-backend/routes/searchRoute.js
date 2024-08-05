import express from 'express';
import {searchYouTube} from '../controllers/fetchKeywordData.js';
import { getSearchList } from '../controllers/getCompleteList.js';
import { channelDetails } from '../controllers/channelController.js';
import { videoDetails } from '../controllers/videoController.js';
import { chatassistantfunc } from '../controllers/chatAssistant.js';
import { ByChannelNameController } from '../controllers/channel-url-to-optimization.js';

const router = express.Router();

router.get('/search', searchYouTube);
router.get('/SearchList', getSearchList);
router.get('/videos/:videoId', videoDetails);
router.get('/channels/:channelId', channelDetails);
router.get('/chatassistant', chatassistantfunc)
router.post('/ByChannelName', ByChannelNameController
)
export default router;
