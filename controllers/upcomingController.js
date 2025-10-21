import axios from "axios";
import {languageMap} from "../utils/languageMap.js";
import Movie from "../models/Movie.js";
import {MovieDetail} from "../init/movieDetail.js";

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// helper to build poster/profile urls
const imageUrl = (path) => (path ? `${IMAGE_BASE}${path}` : null);

// get Upcoming movies
export const getUpcoming = async (req, res) => {
  const region = req.query.region || "IN"; // or 'NP'
  try {
    const r = await axios.get(`${TMDB_BASE}/movie/upcoming`, {
      params: {api_key: TMDB_KEY, language: "en-US", page: 1, region: region},
    });
    const results = (r.data.results || []).map((m) => ({
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
    console.error(err?.response?.data || err.message);
    res.status(500).json({error: "failed to fetch upcoming movies"});
  }
};
