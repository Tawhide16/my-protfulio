import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/SiteContent';
import { defaultSiteContent } from '@/data/defaultContent';

export async function GET() {
  try {
    await connectToDatabase();
    const content = await SiteContent.findOne({ key: 'main_content' });

    if (content) {
      return NextResponse.json({
        success: true,
        data: {
          hero: { ...defaultSiteContent.hero, ...(content.hero || {}) },
          about: { ...defaultSiteContent.about, ...(content.about || {}) },
          skills:
            content.skills && Array.isArray(content.skills) && content.skills.length > 0
              ? content.skills
              : defaultSiteContent.skills,
          skillsStats: { ...defaultSiteContent.skillsStats, ...(content.skillsStats || {}) },
          contact: {
            ...defaultSiteContent.contact,
            ...(content.contact || {}),
            socials: {
              ...defaultSiteContent.contact.socials,
              ...((content.contact && content.contact.socials) || {}),
            },
          },
          footer: { ...defaultSiteContent.footer, ...(content.footer || {}) },
        },
      });
    }

    return NextResponse.json({ success: true, data: defaultSiteContent, isDefault: true });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: defaultSiteContent,
      isDefault: true,
      error: error.message,
    });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const updated = await SiteContent.findOneAndUpdate(
      { key: 'main_content' },
      {
        $set: {
          key: 'main_content',
          hero: body.hero,
          about: body.about,
          skills: body.skills,
          skillsStats: body.skillsStats,
          contact: body.contact,
          footer: body.footer,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Site content updated successfully',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update content' },
      { status: 500 }
    );
  }
}
