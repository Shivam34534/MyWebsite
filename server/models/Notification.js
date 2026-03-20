import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true }, // Who receives it
    sender: { type: String, ref: 'User', required: true }, // Who triggered it
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Optional target post
    type: { type: String, enum: ['like', 'comment', 'follow'], required: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
