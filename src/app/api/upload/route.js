import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Upload handler:
 *  - Images/profile-image → Cloudinary (if env vars set) → fallback local public/uploads/
 *  - PDFs (resume/cv)     → always local public/uploads/ (tracked in git, small files)
 */

async function uploadToCloudinary(buffer, filename, folder = 'portfolio') {
  const { v2: cloudinary } = await import('cloudinary');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: path.basename(filename, path.extname(filename)),
        overwrite: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

async function saveLocally(buffer, filename) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    const fileType = data.get('type') || 'file'; // 'image', 'profile-image', 'resume', 'cv'

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, message: 'No valid file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'uploaded_file';
    const extension = path.extname(originalName) || '.png';
    const cleanName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9_-]/g, '_');

    let filename = '';
    if (fileType === 'resume') {
      filename = `resume_${Date.now()}${extension}`;
    } else if (fileType === 'cv') {
      filename = `cv_${Date.now()}${extension}`;
    } else {
      filename = `${cleanName}_${Date.now()}${extension}`;
    }

    // PDFs always saved locally; images go to Cloudinary when configured
    const isImage = fileType === 'image' || fileType === 'profile-image';
    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    let publicUrl = '';

    if (isImage && hasCloudinary) {
      try {
        const folder = fileType === 'profile-image' ? 'portfolio/profile' : 'portfolio/projects';
        const result = await uploadToCloudinary(buffer, filename, folder);
        publicUrl = result.secure_url;
      } catch (cloudErr) {
        console.error('Cloudinary upload failed, falling back to local:', cloudErr.message);
        publicUrl = await saveLocally(buffer, filename);
      }
    } else {
      publicUrl = await saveLocally(buffer, filename);
    }

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
