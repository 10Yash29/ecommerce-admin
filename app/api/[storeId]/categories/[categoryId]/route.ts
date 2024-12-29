import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";


export async function GET(
    req:Request,
    {params}:{params:{categoryId:string}}
){
    try {
        if(!params.categoryId){
            return new NextResponse('BillboardId is required', { status: 401 });
        }

        const category = await prismadb.category.findUnique({
            where:{
                id: params.categoryId
            },
            include:{
                billboard: true,
            }
        });
        return NextResponse.json(category);
    }
    catch (error) {
        console.log('[CATEGORY_GET]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string, categoryId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const body = await req.json();
        const {name, billboardId} = body;

        if(!name){
            return new NextResponse('Label is required', { status: 400 });
        }

        if(!billboardId){
            return new NextResponse('Image is required', { status: 400 });
        }

        if(!params.categoryId){
            return new NextResponse('CategoryId is required', { status: 400 });
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
        const categories = await prismadb.category.updateMany({
            where:{
                id: params.categoryId
            },
            data:{
                name,
                billboardId
            }
        });
        return NextResponse.json(categories);
    }
    catch (error) {
        console.log('[CATEGORY_PATCH]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}
export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string, categoryId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if(!params.categoryId) {
            return new NextResponse('CategoryId is required', { status: 401 });
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

        const categories = await prismadb.category.deleteMany({
            where:{
                id: params.categoryId
            }
        });
        return NextResponse.json(categories);
    }
    catch (error) {
        console.log('[CATEGORY_DELETE]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}