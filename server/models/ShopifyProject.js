import mongoose from 'mongoose';

const shopifyProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  features: [{ type: String }],
  accentColor: { type: String, default: '#22c55e' },
  accentRgb: { type: String, default: '34, 197, 94' },
  liveLink: { type: String, required: true },
  image1: { type: String, required: true },
  number: { type: String },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

const ShopifyProject = mongoose.model('ShopifyProject', shopifyProjectSchema);
export default ShopifyProject;
