import Channel from "../models/channelModel.js";

export const channelDetails = async (req, res) => {
    try {
        const details = await Channel.findOne({ channelId: req.params.channelId }) //most relevant first

        let descriptionPreview = '';
        let maxDescriptionLength=20

        if (details.description) {
            descriptionPreview = details.description.length > maxDescriptionLength
                ? details.description.substring(0, maxDescriptionLength) + '...'
                : details.description;
        }
     
        const responseDetails = {
            ...details._doc,
            description: descriptionPreview,
        };

        res.status(200).json(responseDetails);

    } catch (error) {
        console.error('Error fetching ChannelDetails:', error);
        res.status(500).json({ message: 'Failed to fetch keywords' });
    }

};

