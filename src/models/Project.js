import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
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
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    accentColor: {
      type: String,
      default: '#6366f1',
    },
    accentRgb: {
      type: String,
      default: '99, 102, 241',
    },
    liveLink: {
      type: String,
      default: '',
    },
    gitLinkClient: {
      type: String,
      default: '',
    },
    gitLinkServer: {
      type: String,
      default: '',
    },
    image1: {
      type: String,
      default: '/NEXT-CLASS.png',
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

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
