import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    subCategories: [
      {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        subCategories: [
          {
            name: { type: String, required: true },
            slug: { type: String, required: true }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
