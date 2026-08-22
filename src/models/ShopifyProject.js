import mongoose from 'mongoose';

const ShopifyProjectSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      default: ['Shopify', 'Liquid Template', 'Shopify API'],
    },
    features: {
      type: [String],
      default: [],
    },
    accentColor: {
      type: String,
      default: '#22c55e',
    },
    accentRgb: {
      type: String,
      default: '34, 197, 94',
    },
    liveLink: {
      type: String,
      default: '',
    },
    image1: {
      type: String,
      default: '/semilevi.png',
    },
    number: {
      type: String,
      default: '01',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ShopifyProject || mongoose.model('ShopifyProject', ShopifyProjectSchema);
