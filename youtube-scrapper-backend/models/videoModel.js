//VideoModel.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  VideoTitle: {
    type: String,
  },
  videoId: {
    type: String,
  },
  channelTitle: {
    type: String,
  },
  channelId: {
    type: String,
  },
  description: {
    type: String,
  },
  numberOfViews: {
    type: Number,
  },
  numberOfLikes: {
    type: Number,
  },
  numberOfComments: {
    type: Number,
  },
  uploadDate: {
    type: Date,
  },
  tags: {
    type: [String],
  },
  transcript: {
    type: String,
  },
}, {
  timestamps: true,
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
