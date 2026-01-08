import { HttpError } from "../helpers.js";
import Beer from '../models/beer.js';

export async function createBeer(data) {
    const {
        name,
        style,
        country,
        abv,
        ibu,
        description,
        image,
        isCraft,
        createdBy
    } = data;

    const missing = [];
    if (!name) missing.push("name");
    if (!style) missing.push("style");
    if (!country) missing.push("country");
    if (abv === undefined) missing.push("abv");
    if (ibu === undefined) missing.push("ibu");

    if (missing.length > 0) {
        throw new HttpError(400, `Missing required fields: ${missing.join(", ")}`);
    }

    if (typeof abv != "number") {
        throw new HttpError(400, "ABV must be a number");
    }

    if (typeof ibu != "number") {
        throw new HttpError(400, "IBU must be a number");
    }

    if (abv < 0 || abv > 20) {
        throw new HttpError(400, "ABV must be between 0 and 20%");
    }

    if (ibu < 0 || ibu > 100) {
        throw new HttpError(400, "IBU must be between 0 and 100");
    }

    if (!createdBy) {
        throw new HttpError(401, "Unauthorized");
    }

    const beer = await Beer.create({
        name,
        style,
        country,
        abv,
        description,
        image,
        ibu,
        isCraft: Boolean(isCraft),
        createdBy
    });

    return beer.toObject();
}

export async function getAllBeers(filters = {}) {
    const query = {};

    if (filters.style) {
        query.style = filters.style;
    }

    if (filters.country) {
        query.country = filters.country;
    }

    if (typeof filters.isCraft === "boolean") {
        query.isCraft = filters.isCraft;
    }

    const beers = await Beer.find(query).sort({ createdAt: -1 });

    return beers.map((b) => b.toObject());
}

export async function getBeerById(id) {
    const beer = await Beer.findById(id);
    if (!beer) {
        throw new HttpError(404, "Beer not found");
    }
    return beer.toObject();
}

export async function updateBeer(id, data) {
    if (!beer) {
        throw new HttpError(404, "Beer not found");
    }

    const isAdmin = user?.role === "admin";
    const isOwner = user?.id && String(beer.createdBy) === String(user.id);

    if (!isAdmin && !isOwner) {
        throw new HttpError(403, "You can update only your own beers");
    }
    
    const beer = await Beer.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    return beer.toObject();
}

export async function deleteBeer(id, user) {
    const beer = await Beer.findByIdAndDelete(id);

    if (!beer) {
        throw new HttpError(404, "Beer not found");
    }

    if (user?.role === "admin") {
        await Beer.findByIdAndDelete(id);
        return { message: "Beer deleted successfully" }
    }

    if (!user?.id || String(beer.createdBy) !== String(user.id)) {
        throw new HttpError(403, "You can delete only your own beers");
    }
    return { message: "Beer deleted successfully" };
}

export async function getCraftBeers() {
    const beers = await Beer.find({ isCraft: true }).sort({ createdAt: -1 });
    return beers.map((b) => b.toObject());
}

