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
          contact: {
            ...defaultSiteContent.contact,
            ...(content.contact || {}),
            socials: {
              ...defaultSiteContent.contact.socials,
              ...((content.contact && content.contact.socials) || {}),
            },
          },
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
        key: 'main_content',
        hero: body.hero,
        about: body.about,
        contact: body.contact,
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
