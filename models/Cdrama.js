import mongoose from "mongoose";

const cdramaSchema = new mongoose.Schema({
        title: {type: String, required: true},
        leads: {type: String, required: true},
        genre: {type: String, required: true},
        episodes: {type: Number, required: true},
        imageUrl: {type: String, required: false}, // Added imageUrl field
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                // Links are now handled in the controller/router to ensure dynamic URLs
                delete ret._id;
            },
        },
    }
);

const Cdrama = mongoose.model('Cdrama', cdramaSchema);

export default Cdrama;