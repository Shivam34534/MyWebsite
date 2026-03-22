import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true },
    content: { type: String },
    media_url: { type: String },
    media_type: { type: String, enum: ['text', 'image', 'video'] },
    views_count: [{ type: String, ref: 'User' }],
    background_color: { type: String },
}, { timestamps: true, minimize: false })

// Tell MongoDB to automatically delete the entire document 24 hours (86,400 seconds) after the timestamp
storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Story = mongoose.model('Story', storySchema)

export default Story;