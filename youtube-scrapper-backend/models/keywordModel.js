//KeywordModel.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const keywordSchema = new mongoose.Schema({
    keyword: {
        type: String,
    },
    keywordId: {
        type: String,
        unique: true,
        default: uuidv4,
    },
    videoIds: {
        type: [String]
    },
    channelIds: {
        type: [String]
    }
}, {
    timestamps: true,
});

const Keyword = mongoose.model('Keyword', keywordSchema);

export default Keyword;
