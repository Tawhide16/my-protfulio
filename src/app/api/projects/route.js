import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { projects as defaultProjects } from '@/data/projectsData';

export async function GET() {
  try {
    await connectToDatabase();
    const dbProjects = await Project.find({}).sort({ order: 1, createdAt: -1 });

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
        gitLinkClient: p.gitLinkClient,
        gitLinkServer: p.gitLinkServer,
        image1: p.image1,
        number: p.number,
      }));
      return NextResponse.json({ success: true, data: formatted });
    }

    // Fallback to static dataset if database is fresh
    return NextResponse.json({ success: true, data: defaultProjects, isDefault: true });
  } catch (error) {
    // If DB is offline / unreachable, fallback to default static data gracefully
    return NextResponse.json({
      success: true,
      data: defaultProjects,
      isDefault: true,
      error: error.message,
    });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const customId = body.id ? body.id.toString() : Date.now().toString();
    const count = await Project.countDocuments();
    const formattedNumber = count < 9 ? `0${count + 1}` : `${count + 1}`;

    const newProject = await Project.create({
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
      accentColor: body.accentColor || '#6366f1',
      accentRgb: body.accentRgb || '99, 102, 241',
      liveLink: body.liveLink || '',
      gitLinkClient: body.gitLinkClient || '',
      gitLinkServer: body.gitLinkServer || '',
      image1: body.image1 || '/NEXT-CLASS.png',
      number: body.number || formattedNumber,
      order: count,
    });

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}
