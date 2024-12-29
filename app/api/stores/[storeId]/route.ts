import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const body = await req.json();
        const {name} = body;

        if(!name){
            return new NextResponse('Name is required', { status: 401 });
        }
        if(!params.storeId){
            return new NextResponse('StoreId is required', { status: 401 });
        }

        const store = await prismadb.store.updateMany({
            where:{
                id: params.storeId,
                userId: userId,
            },
            data:{
                name
            }
        });
        return NextResponse.json(store);
    }
    catch (error) {
        console.log('[STORE_PATCH]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}
export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try {
        const {userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if(!params.storeId){
            return new NextResponse('StoreId is required', { status: 401 });
        }

        const store = await prismadb.store.deleteMany({
            where:{
                id: params.storeId,
                userId: userId,
            }
        });
        return NextResponse.json(store);
    }
    catch (error) {
        console.log('[STORE_DELETE]',error);
        return new NextResponse('Internal Error', {status: 500});
    }

}