import {Inngest} from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({id: "qfxcinema"});

// inngest function to save user signups
const userSignup = inngest.createFunction(
  {id: "user/signup"},
  {event: "clerk/user.created"},
  async ({event}) => {
    const {id, first_name, last_name, email_addresses, image_url} = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.create(userData);
  }
);

// inngest function to delete users
const userDeleted = inngest.createFunction(
  {id: "user/deleted"},
  {event: "clerk/user.deleted"},
  async ({event, step}) => {
    const {id} = event.data;
    await User.findByIdAndDelete(id);
  }
);

// inngest functions to update users
const userUpdated = inngest.createFunction(
  {id: "user/updated"},
  {event: "clerk/user.updated"},
  async ({event, step}) => {
    const {id, first_name, last_name, email_addresses, image_url} = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate({_id: id}, userData);
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [userSignup, userDeleted, userUpdated];
