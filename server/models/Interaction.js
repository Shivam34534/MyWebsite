import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    type: { type: String, enum: ['view', 'like', 'comment'], required: true },
    duration: { type: Number, default: 0 } // duration in seconds/ms, mainly for views mapping
}, { timestamps: true });

// Indexes for fast querying of recent user interactions
interactionSchema.index({ user: 1, createdAt: -1 });
interactionSchema.index({ user: 1, type: 1, createdAt: -1 });
interactionSchema.index({ post: 1, user: 1 }); // For duplicate checks

const Interaction = mongoose.model('Interaction', interactionSchema);

export default Interaction;
