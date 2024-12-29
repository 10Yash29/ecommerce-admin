import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function GET(
    req:Request,
    {params}:{params:{sizeId:string}}
){
    try {
        if(!params.sizeId){
            return new NextResponse('sizeId is required', { status: 401 });
        }

        const size = await prismadb.size.findUnique({
            where:{
                id: params.sizeId
            }
        });
        return NextResponse.json(size);
    }
    catch (error) {
        console.log('[SIZE_GET]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string, sizeId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const body = await req.json();
        const {name, value} = body;

        if(!name){
            return new NextResponse('Label is required', { status: 400 });
        }

        if(!value){
            return new NextResponse('Image is required', { status: 400 });
        }

        if(!params.sizeId){
            return new NextResponse('sizeId is required', { status: 400 });
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId: userId,
            }
        })
        if(!storeByUserId){
            return new NextResponse('Unauthorized', { status: 403 });
        }
        const sizes = await prismadb.size.updateMany({
            where:{
                id: params.sizeId
            },
            data:{
               name, value
            }
        });
        return NextResponse.json(sizes);
    }
    catch (error) {
        console.log('[SIZE_PATCH]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}
export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string, sizeId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if(!params.sizeId){
            return new NextResponse('sizeId is required', { status: 401 });
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId: userId,
            }
        })
        if(!storeByUserId){
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const sizes = await prismadb.size.deleteMany({
            where:{
                id: params.sizeId
            }
        });
        return NextResponse.json(sizes);
    }
    catch (error) {
        console.log('[SIZE_DELETE]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}