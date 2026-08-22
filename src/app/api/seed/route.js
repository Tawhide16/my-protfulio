import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import ShopifyProject from '@/models/ShopifyProject';
import { projects as defaultProjects, shopifyProjects as defaultShopifyProjects } from '@/data/projectsData';

export async function POST() {
  try {
    await connectToDatabase();

    // 1. Seed MERN Projects
    let seededProjectsCount = 0;
    for (let i = 0; i < defaultProjects.length; i++) {
      const p = defaultProjects[i];
      await Project.findOneAndUpdate(
        { customId: p.id.toString() },
        {
          customId: p.id.toString(),
          title: p.title,
          subtitle: p.subtitle || '',
          description: p.description,
          technologies: p.technologies || [],
          features: p.features || [],
          accentColor: p.accentColor || '#6366f1',
          accentRgb: p.accentRgb || '99, 102, 241',
          liveLink: p.liveLink || '',
          gitLinkClient: p.gitLinkClient || '',
          gitLinkServer: p.gitLinkServer || '',
          image1: p.image1 || '/NEXT-CLASS.png',
          number: p.number || `0${i + 1}`,
          order: i,
        },
        { upsert: true, new: true }
      );
      seededProjectsCount++;
    }

    // 2. Seed Shopify Projects
    let seededShopifyCount = 0;
    for (let i = 0; i < defaultShopifyProjects.length; i++) {
      const sp = defaultShopifyProjects[i];
      await ShopifyProject.findOneAndUpdate(
        { customId: sp.id.toString() },
        {
          customId: sp.id.toString(),
          title: sp.title,
          subtitle: sp.subtitle || '',
          description: sp.description,
          technologies: sp.technologies || ['Shopify', 'Liquid Template', 'Shopify API'],
          features: sp.features || [],
          accentColor: sp.accentColor || '#22c55e',
          accentRgb: sp.accentRgb || '34, 197, 94',
          liveLink: sp.liveLink || '',
          image1: sp.image1 || '/semilevi.png',
          number: sp.number || (i < 9 ? `0${i + 1}` : `${i + 1}`),
          order: i,
        },
        { upsert: true, new: true }
      );
      seededShopifyCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded! (${seededProjectsCount} MERN projects & ${seededShopifyCount} Shopify projects)`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Database connection / seeding error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
