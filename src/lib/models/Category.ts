import mongoose from "mongoose";
import { z } from "zod";

export interface ICategory extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string; // Name of the category (e.g., "T-Shirts", "Jeans")
  slug: string; // URL-friendly version of the name (e.g., "t-shirts", "jeans")
  description?: string; // Optional description of the category
  parent?: mongoose.Types.ObjectId; // For subcategories (self-referential)
  image?: string; // URL to category image/thumbnail
  isActive: boolean; // To enable/disable categories without deleting
  seoTitle?: string; // SEO optimized title
  seoDescription?: string; // SEO meta description
  sortOrder?: number; // For custom sorting of categories
  createdAt: Date; // When the category was created
  updatedAt: Date;
}

export const CategoryValidator = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z
    .string()
    .min(
      3,
      "Slug must be in lowercase and contain only letters, numbers, and hyphens"
    ),
  description: z.string().optional(),
  parent: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  sortOrder: z.number().optional(),
});

const CategorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        return slugRegex.test(v);
      },
      message:
        "Slug must be in lowercase and contain only letters, numbers, and hyphens",
    },
  },
  description: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  seoTitle: { type: String },
  seoDescription: { type: String },
  sortOrder: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CategorySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

const Category =
  (mongoose.models.Category as mongoose.Model<ICategory>) ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
