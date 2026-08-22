import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No IDs provided' }, { status: 400 });
    }

    // Update each project's order field based on position in the ids array
    const updates = ids.map((id, index) =>
      Project.findByIdAndUpdate(id, { order: index }, { new: true })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
