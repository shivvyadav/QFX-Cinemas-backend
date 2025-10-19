import axios from "axios";

import Movie from "../models/Movie.js";

export const getMovieDetail = async (req, res) => {
  const movieId = req.params.id;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({error: "Movie not found"});
    }
    res.json(movie);
  } catch (err) {
    console.error("Movie detail fetch error:", err?.response?.data || err.message);
    res.status(500).json({error: "Failed to fetch movie detail"});
  }
};
