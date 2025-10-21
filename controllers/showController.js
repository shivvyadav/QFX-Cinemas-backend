import axios from "axios";
import Movie from "../models/Movie.js";
import booking from "../models/booking.js";

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
    const newShow = new Show({
      _id: movie.id,
      title: movie.title,
      poster: movie.poster,
      genres: movie.genres,
      language: movie.language,
      runtime: movie.runtime,
      release_date: movie.release_date,
      description: movie.description,
      cast: movie.cast,
      youtube_trailer: movie.youtube_trailer,
      showDateTime,
    });
    await newShow.save();
    res.status(201).json({message: "Show added successfully"});
  } catch (err) {
    console.error("Show add error:", err?.response?.data || err.message);
    res.status(500).json({error: "Show already exists"});
  }
};

// 3) delete show
export const deleteShow = async (req, res) => {
  const showId = req.params.id;
  try {
    await Show.findByIdAndDelete(showId);
    res.json({message: "Show deleted successfully"});
  } catch (err) {
    console.error("Show delete error:", err?.response?.data || err.message);
    res.status(500).json({error: "Failed to delete show"});
  }
};

// // 4) get all active shows
export const getActiveShows = async (req, res) => {
  try {
    const shows = await Show.find({});
    res.json(shows);
  } catch (err) {
    console.error("Active shows fetch error:", err?.response?.data || err.message);
    res.status(500).json({error: "Failed to fetch active shows"});
  }
};

// 5) get show by id
export const getShowById = async (req, res) => {
  const showId = req.params.id;
  try {
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({error: "Show not found"});
    } else {
      res.json(show);
    }
  } catch (err) {
    console.error("Show by id fetch error:", err?.response?.data || err.message);
    res.status(500).json({error: "Failed to fetch show by id"});
  }
};

// 6) update show
export const updateShow = async (req, res) => {
  const {id} = req.params;
  console.log(id);
  const {date, time, seats} = req.body; // expect: {date: "2025-10-17", time: "13:00", seats: ["A1", "B2"]}
  try {
    const show = await Show.findById(id);
    if (!show) return res.status(404).json({message: "Show not found"});

    if (Array.isArray(show.occupiedSeats)) {
      show.occupiedSeats = {};
    }
    // ensure structure
    if (!show.occupiedSeats.get(date)) {
      show.occupiedSeats.set(date, new Map());
    }
    const dayMap = show.occupiedSeats.get(date);
    const already = dayMap.get(time) || [];

    // merge old + new, ensuring unique seats
    const updated = [...new Set([...already, ...seats])];
    dayMap.set(time, updated);
    show.occupiedSeats.set(date, dayMap);

    await show.save();
    res.status(200).json({message: "Seats booked successfully", occupiedSeats: show.occupiedSeats});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Server error"});
  }
};

// 7) get shows summary
export const getShowsSummary = async (req, res) => {
  try {
    const shows = await Show.find();
    // Aggregate total bookings and earnings by show
    const bookings = await booking.aggregate([
      {
        $group: {
          _id: "$show", // 'show' in booking refers to show._id
          totalBookings: {$sum: 1},
          totalEarnings: {$sum: "$totalAmount"},
        },
      },
    ]);
    // Map results for quick lookup
    const bookingMap = {};
    bookings.forEach((b) => {
      bookingMap[b._id] = {
        totalBookings: b.totalBookings,
        totalEarnings: b.totalEarnings,
      };
    });
    // Merge booking data into show list
    const result = shows.map((show) => ({
      id: show._id,
      title: show.title,
      totalBookings: bookingMap[show._id]?.totalBookings || 0,
      totalEarnings: bookingMap[show._id]?.totalEarnings || 0,
    }));
    res.status(200).json({success: true, shows: result});
  } catch (error) {
    console.error("Error fetching shows summary:", error);
    res.status(500).json({success: false, message: "Server error"});
  }
};
