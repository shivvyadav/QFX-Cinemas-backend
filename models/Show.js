import {mongoose} from "mongoose";
import Movie from "./Movie.js";

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Movie,
      required: true,
    },
    showDateTime: {
      type: Object,
      required: true,
    },
    occupiedSeats: {
      type: [String],
      default: [],
    },
  },
  {minimize: false}
);
const Show = mongoose.model("Show", showSchema);
export default Show;
