import {
  createBeer,
  getAllBeers,
  getBeerById,
  updateBeer,
  deleteBeer,
  getCraftBeers
} from "../services/beerService.js";
import { HttpError } from "../helpers.js";

export async function createBeerController(req, res) {
  try {
    const beer = await createBeer({ ...req.body, createdBy: req.user?.id });
    res.status(201).json({ message: "Beer created successfully", beer });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.errors || err.message || "Server error" });
  }
}

export async function getAllBeersController(req, res) {
  try {
    const filters = {
      style: req.query.style,
      country: req.query.country,
    };

    // query params идват като string, затова:
    if (req.query.isCraft !== undefined) {
      filters.isCraft = req.query.isCraft === "true";
    }

    const beers = await getAllBeers(filters);
    res.status(200).json(beers);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.errors || err.message || "Server error" });
  }
}

export async function getBeerByIdController(req, res) {
  try {
    const beer = await getBeerById(req.params.id);
    res.status(200).json(beer);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.errors || err.message || "Server error" });
  }
}

export async function updateBeerController(req, res) {
  try {
    const beer = await updateBeer(req.params.id, req.body, req.user);
    res.status(200).json({ message: "Beer updated successfully", beer });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.errors || err.message || "Server error" });
  }
}

export async function deleteBeerController(req, res) {
  try {
    const result = await deleteBeer(req.params.id, req.user);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.errors || err.message || "Server error" });
  }
}

export async function getCraftBeersController(req, res) {
  try {
    const beers = await getCraftBeers();
    res.status(200).json(beers);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.errors || err.message || "Server error" });
  }
}
