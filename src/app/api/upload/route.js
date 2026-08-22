import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    const fileType = data.get('type') || 'file'; // 'image', 'resume', 'cv'

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: 'No valid file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate safe filename
    const originalName = file.name || 'uploaded_file';
    const extension = path.extname(originalName) || (file.type === 'application/pdf' ? '.pdf' : '.png');
    const cleanName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // For resume and cv, we can give predictable names or timestamped names
    let filename = '';
    if (fileType === 'resume') {
      filename = `resume_${Date.now()}${extension}`;
    } else if (fileType === 'cv') {
      filename = `cv_${Date.now()}${extension}`;
    } else {
      filename = `${cleanName}_${Date.now()}${extension}`;
    }

    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl,
      filename,
      originalName,
      size: file.size,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
