import {mongoose} from "mongoose";

const movieSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
  },
  genres: {
    type: [String],
    default: [],
  },
  language: {
    type: String || null,
  },
  runtime: {
    type: Number,
  },
  release_date: {
    type: String,
  },
  description: {
    type: String,
  },
  cast: {
    type: Array,
    default: [],
  },
  youtube_trailer: {
    type: String,
  },
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
