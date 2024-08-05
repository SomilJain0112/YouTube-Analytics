import Video from "../models/videoModel.js";

export const videoDetails = async (req, res) => {
   // console.log("video controller is called and videoId is ", req.params.videoId);
    
    try {
        const details = await Video.findOne({ videoId: req.params.videoId });

        const maxTranscriptLength = 30; 
        const maxDescriptionLength = 30; 

        let transcriptPreview = '';
        let descriptionPreview = '';

        // Truncate the transcript if it exists
        if (details.transcript) {
            transcriptPreview = details.transcript.length > maxTranscriptLength
                ? details.transcript.substring(0, maxTranscriptLength) + '...'
                : details.transcript;
        }

        // Truncate the description if it exists
        if (details.description) {
            descriptionPreview = details.description.length > maxDescriptionLength
                ? details.description.substring(0, maxDescriptionLength) + '...'
                : details.description;
        }

        // console.log("Transcript length is ", transcriptPreview.length, transcriptPreview);
        // console.log("Description length is ", descriptionPreview.length, descriptionPreview);

        const responseDetails = {
            ...details._doc,
            transcript: transcriptPreview,
            description: descriptionPreview,
        };

        res.status(200).json(responseDetails);

    } catch (error) {
        console.error('Error fetching VideoDetails:', error);
        res.status(500).json({ message: 'Failed to fetch video details' });
    }
};
