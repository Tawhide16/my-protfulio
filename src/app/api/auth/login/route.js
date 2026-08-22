import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Tawhide16#';

    const validUsernames = ['admin', 'protfulio', 'tawhid', 'tawhide'];
    const validPasswords = [adminPassword, 'Tawhide16#'];

    const isPasswordValid = validPasswords.includes(password);
    const isUserValid = !username || validUsernames.includes(username.toLowerCase().trim());

    if (isPasswordValid && isUserValid) {
      return NextResponse.json({
        success: true,
        message: 'Authenticated successfully',
        token: Buffer.from(`admin_${Date.now()}_${adminPassword}`).toString('base64'),
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
