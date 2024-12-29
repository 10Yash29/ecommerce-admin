import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function GET(
    req:Request,
    {params}:{params:{colorId:string}}
){
    try {
        if(!params.colorId){
            return new NextResponse('colorId is required', { status: 401 });
        }

        const color = await prismadb.color.findUnique({
            where:{
                id: params.colorId
            }
        });
        return NextResponse.json(color);
    }
    catch (error) {
        console.log('[COLOR_GET]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string, colorId:string}}
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

        if(!params.colorId){
            return new NextResponse('colorId is required', { status: 400 });
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
        const colors = await prismadb.color.updateMany({
            where:{
                id: params.colorId
            },
            data:{
               name, value
            }
        });
        return NextResponse.json(colors);
    }
    catch (error) {
        console.log('[COLOR_PATCH]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}
export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string, colorId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if(!params.colorId){
            return new NextResponse('colorId is required', { status: 401 });
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

        const colors = await prismadb.color.deleteMany({
            where:{
                id: params.colorId
            }
        });
        return NextResponse.json(colors);
    }
    catch (error) {
        console.log('[COLOR_DELETE]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}