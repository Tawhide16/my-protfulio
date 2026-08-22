import mongoose from 'mongoose';

const SiteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_content',
      unique: true,
    },
    hero: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    about: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    skills: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    skillsStats: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    contact: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    footer: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);
