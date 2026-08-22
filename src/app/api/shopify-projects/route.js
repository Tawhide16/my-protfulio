import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ShopifyProject from '@/models/ShopifyProject';
import { shopifyProjects as defaultShopifyProjects } from '@/data/projectsData';

export async function GET() {
  try {
    await connectToDatabase();
    const dbProjects = await ShopifyProject.find({}).sort({ order: 1, createdAt: -1 });

    if (dbProjects && dbProjects.length > 0) {
      const formatted = dbProjects.map((p) => ({
        id: p.customId,
        _id: p._id.toString(),
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        technologies: p.technologies,
        features: p.features,
        accentColor: p.accentColor,
        accentRgb: p.accentRgb,
        liveLink: p.liveLink,
        image1: p.image1,
        number: p.number,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({ success: true, data: defaultShopifyProjects, isDefault: true });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: defaultShopifyProjects,
      isDefault: true,
      error: error.message,
    });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const customId = body.id ? body.id.toString() : `shopify-${Date.now()}`;
    const count = await ShopifyProject.countDocuments();
    const formattedNumber = count < 9 ? `0${count + 1}` : `${count + 1}`;

    const newProject = await ShopifyProject.create({
      customId,
      title: body.title,
      subtitle: body.subtitle || '',
      description: body.description,
      technologies: Array.isArray(body.technologies)
        ? body.technologies
        : (body.technologies || '').split(',').map((t) => t.trim()).filter(Boolean),
      features: Array.isArray(body.features)
        ? body.features
        : (body.features || '').split('\n').map((f) => f.trim()).filter(Boolean),
      accentColor: body.accentColor || '#22c55e',
      accentRgb: body.accentRgb || '34, 197, 94',
      liveLink: body.liveLink || '',
      image1: body.image1 || '/semilevi.png',
      number: body.number || formattedNumber,
      order: count,
    });

    return NextResponse.json({
      success: true,
      message: 'Shopify project created successfully',
      data: newProject,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create Shopify project' },
      { status: 500 }
    );
  }
}
