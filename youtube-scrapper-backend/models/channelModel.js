//ChannelModel.js
import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
  },
  channelId: {
    type: String,
  },
  description: {
    type: String,
  },
  numberOfSubscribers: {
    type: Number,
  },
  totalNumberOfVideos: {
    type: Number,
  },
  channelCreationDate: {
    type: Date,
  },
  views: {
    type: Number,
  }
}, {
  timestamps: true,
});

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
