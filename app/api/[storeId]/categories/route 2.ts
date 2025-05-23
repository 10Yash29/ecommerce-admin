import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request, {params}:{params: {storeId : string}}) {
    try {
        const { userId } = auth();
        const body = await req.json(); // Await the parsed body
        const { label, imageUrl } = body; // Destructure directly after awaiting

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }
        if (!label) {
            return new NextResponse('label is required', { status: 400 });
        }
        if(!imageUrl){
            return new NextResponse('Image is required', { status: 400 });
        }

        if(!params.storeId){
            return new NextResponse('StoreId is required', { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId: userId,
            }
        })

        if(!storeByUserId){
            return new NextResponse('Unauthorized', { status: 400 });
        }
        const billboard = await prismadb.billboard.create({
            data: { label, imageUrl, storeId: params.storeId },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


export async function GET(req: Request, {params}:{params: {storeId : string}}) {
    try {
        if(!params.storeId){
            return new NextResponse('StoreId is required', { status: 400 });
        }

        const billboards = await prismadb.billboard.findMany({
            where :{
                storeId: params.storeId,
            }
        })
        return NextResponse.json(billboards);
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}



