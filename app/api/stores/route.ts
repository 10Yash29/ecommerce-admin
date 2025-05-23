import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json(); // Await the parsed body
        const { name } = body; // Destructure directly after awaiting

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        const store = await prismadb.store.create({
            data: { name, userId },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

