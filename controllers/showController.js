import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import {languageMap} from "../utils/languageMap.js";
import {MovieDetail} from "../init/movieDetail.js";

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// helper to build poster/profile urls
const imageUrl = (path) => (path ? `${IMAGE_BASE}${path}` : null);

// 1) get current movies
export const getNowPlaying = async (req, res) => {
  const region = req.query.region || "IN"; // or 'NP'
  const page = req.query.page || 1;
  try {
    const tmdbResp = await axios.get(`${TMDB_BASE}/movie/now_playing`, {
      params: {
        api_key: TMDB_KEY,
        language: "en-US",
        region: region,
        page: page,
      },
    });
    const results = (tmdbResp.data.results || []).map((m) => ({
      _id: m.id,
      title: m.title,
      poster: imageUrl(m.poster_path),
      release_date: m.release_date,
      language: languageMap[m.original_language] || m.original_language,
    }));
    res.json({results});
    results.forEach(async (m) => {
      const exists = await Movie.findById(m._id);
      if (!exists) {
        await MovieDetail(m._id);
      }
    });
  } catch (err) {
    console.error("Now playing fetch error:", err?.response?.data || err.message);
    res.status(500).json({error: "Failed to fetch now playing movies"});
  }
};

// 2) add show
export const addShow = async (req, res) => {
  const {movieId, showDateTime} = req.body;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({error: "Movie not found"});
    }
    const newShow = new Show({movie, showDateTime});
    await newShow.save();
    res.status(201).json({message: "Show added successfully"});
  } catch (err) {
    console.error("Show add error:", err?.response?.data || err.message);
    res.status(500).json({error: "Failed to add show"});
  }
};
