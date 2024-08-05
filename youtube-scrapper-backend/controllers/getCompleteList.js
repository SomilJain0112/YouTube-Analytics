import Keyword from "../models/keywordModel.js";
import Channel from "../models/channelModel.js";
import Video from "../models/videoModel.js";

export const getSearchList = async (req, res) => {
  try {
    // Fetching keywords
    const keywords = await Keyword.find({}, {
      keyword: 1,
      keywordId: 1,
      videoIds: 1,
      channelIds: 1
    }).sort({ createdAt: -1 });

    // Fetching channels
    const channels = await Channel.find({}, {
      channelName: 1,
      channelId: 1,
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

    // Truncate descriptions and transcripts
    const truncatedChannels = channels.map(channel => ({
      ...channel._doc,
      description: channel.description?.length > 20
        ? channel.description.substring(0, 20) + '...'
        : channel.description
    }));

    const truncatedVideos = videos.map(video => ({
      ...video._doc,
      description: video.description?.length > 20
        ? video.description.substring(0, 20) + '...'
        : video.description,
      transcript: video.transcript?.length > 20
        ? video.transcript.substring(0, 20) + '...'
        : video.transcript
    }));

    // Sending the combined results
    res.status(200).json({
      keywords,
      channels: truncatedChannels,
      videos: truncatedVideos
    });

  } catch (error) {
    console.error('Error fetching Complete list:', error);
    res.status(500).json({ message: 'Failed to fetch data', error });
  }
};
