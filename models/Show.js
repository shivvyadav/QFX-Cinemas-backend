import {mongoose} from "mongoose";
import movieSchema from "./Movie.js";

const showSchema = new mongoose.Schema(
  {
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
    showDateTime: {
      type: Object,
      required: true,
    },
    occupiedSeats: {
      type: Map,
      of: Map,
      default: {},
    },
  },
  {minimize: false}
);
const Show = mongoose.model("Show", showSchema);
export default Show;
