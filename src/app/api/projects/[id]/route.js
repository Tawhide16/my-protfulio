import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const project = await Project.findOne({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();

    const updated = await Project.findOneAndUpdate(
      {
        $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      },
      {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        technologies: Array.isArray(body.technologies)
          ? body.technologies
          : (body.technologies || '').split(',').map((t) => t.trim()).filter(Boolean),
        features: Array.isArray(body.features)
          ? body.features
          : (body.features || '').split('\n').map((f) => f.trim()).filter(Boolean),
        accentColor: body.accentColor,
        accentRgb: body.accentRgb,
        liveLink: body.liveLink,
        gitLinkClient: body.gitLinkClient,
        gitLinkServer: body.gitLinkServer,
        image1: body.image1,
        number: body.number,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deleted = await Project.findOneAndDelete({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
