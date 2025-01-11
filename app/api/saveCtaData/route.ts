import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

type FormData = {
  name: string;
  email: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FormData;

    // Path to save data in the root directory
    const filePath = path.join(process.cwd(), 'cta_captured_data.json');

    // Read existing data
    let existingData: FormData[] = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      existingData = JSON.parse(fileData || '[]');
    }

    // Append new data
    const newData = [...existingData, body];

    // Write updated data to file
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to save data',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
}
