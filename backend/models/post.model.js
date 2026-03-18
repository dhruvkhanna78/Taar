import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: { type: String, default: "" },
  image: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  category: {
    type: String,
    enum: ["","Entertainment", "Learning", "Coding", "Art & Literature", "Gaming", "Sports"],
    required: false,
  },
  tag: {
    type: String,
    enum: [
      "",
      "Memes",
      "Personal",
      "Facts",
      "Tutorials",
      "DSA",
      "Dev",
      "Artworks",
      "Poems",
      "Stories",
      null,
    ],
    required: false,
  },
},{ timestamps: true });

export const Post = mongoose.model("Post", postSchema);
