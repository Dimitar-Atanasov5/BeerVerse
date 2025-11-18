import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    beer: {type: mongoose.Schema.Types.ObjectId, ref: 'Beer', required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String, maxlength: 500},
}, {timestamps: true});

reviewSchema.index({ beer: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);