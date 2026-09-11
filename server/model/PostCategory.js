const mongoos = require("mongoose");

const Schema = mongoos.Schema;

const postCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String
  },
  desc: {
    type: String
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],
});

module.exports = mongoos.model("PostCategory", postCategorySchema);
