import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  features: [{ type: String }],
  accentColor: { type: String, default: '#d90429' },
  accentRgb: { type: String, default: '217, 4, 41' },
  liveLink: { type: String, required: true },
  gitLinkClient: { type: String },
  gitLinkServer: { type: String },
  image1: { type: String, required: true },
  number: { type: String },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
