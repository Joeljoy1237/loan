// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const { path } = await request.json();
    if (path) {
        revalidatePath(path);
        return Response.json({ revalidated: true });
    }
    return Response.json({ error: 'Path required' }, { status: 400 });
}