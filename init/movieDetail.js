import axios from "axios";
import Movie from "../models/Movie.js";
import {languageMap} from "../utils/languageMap.js";

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const imageUrl = (path) => (path ? `${IMAGE_BASE}${path}` : null);

export const MovieDetail = async (id) => {
  try {
    const r = await axios.get(`${TMDB_BASE}/movie/${id}`, {
      params: {
        api_key: TMDB_KEY,
        language: "en-US",
        append_to_response: "videos,credits,release_dates",
      },
    });
    const d = r.data;

    let youtubeTrailer = null;
    // 🎬 Check in appended videos
    const vids = d.videos?.results || [];
    let trailer =
      vids.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
      vids.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      vids.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
      vids.find((v) => v.site === "YouTube");

    if (trailer) {
      youtubeTrailer = `https://www.youtube.com/watch?v=${trailer.key}`;
    } else {
      // 🔁 Fallback: fetch /videos separately
      const videoRes = await axios.get(`${TMDB_BASE}/movie/${id}/videos`, {
        params: {api_key: TMDB_KEY, language: "en-US"},
      });

      const altVideos = videoRes.data.results || [];
      const altTrailer =
        altVideos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
        altVideos.find((v) => v.site === "YouTube" && v.type === "Trailer");

      if (altTrailer) {
        youtubeTrailer = `https://www.youtube.com/watch?v=${altTrailer.key}`;
      }
    }
    const cast = (d.credits?.cast || []).slice(0, 10).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile: imageUrl(c.profile_path),
    }));

    const out = {
      _id: d.id,
      title: d.title,
      poster: imageUrl(d.poster_path),
      genres: (d.genres || []).map((g) => g.name),
      language: languageMap[d.original_language] || d.spoken_languages?.[0]?.name || null,
      runtime: d.runtime,
      release_date: d.release_date,
      description: d.overview,
      cast,
      youtube_trailer: youtubeTrailer,
    };
    await Movie.create(out);
  } catch (err) {
    console.error(err?.response?.data || err.message);
  }
};

// async function removeDatas() {
//   await Movie.deleteMany({});
//   console.log("All movie data removed");
// }

// removeDatas();
