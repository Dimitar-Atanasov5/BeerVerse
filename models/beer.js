import mongoose from "mongoose";

const beerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    style: { type: String, required: true },
    country: { type: String, required: true },
    abv: { type: Number, required: true },
    ibu: { type: Number, required: true },
    description: { type: String, maxlength: 500 },
    image: {type: String, default: null},
    isCraft: {type: Boolean, default: false},
    averageRating: {type: Number, min: 1, max: 5, default: 0},
    ratingsCount: {type: Number, default: 0},

}, {timestamps: true}); 

export default mongoose.model('Beer', beerSchema);