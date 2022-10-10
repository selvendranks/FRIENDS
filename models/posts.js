const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  image: [
    {
      url: String,
      filename: String
    },
  ],
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  likes: [
    {
      type: String,
    },
  ],
  reviews: [
    {
      body: {
        type: String,
      },
      author: {
        type: String,
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
