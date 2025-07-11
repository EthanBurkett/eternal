import mongoose from "mongoose";
import { ICategory } from "./Category";
import { z } from "zod";

export interface IProduct extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category?: ICategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductValidator = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z
    .string()
    .min(
      3,
      "Slug must be in lowercase and contain only letters, numbers, and hyphens"
    ),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  images: z.array(z.string()),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
});

const ProductSchema = new mongoose.Schema<IProduct>({
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
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
