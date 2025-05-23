import BillBoardClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/client";
import prismadb from "@/lib/prismadb";
import {BillboardColumn} from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/column";
import {format} from "date-fns";

const Billboards = async ({params}:{params : {storeId : string}})=>{

    const billboard = await prismadb.billboard.findMany({
        where:{
            storeId : params.storeId
        },
        orderBy:{
            createdAt: 'desc'
        }
    });

    const formattedBillboards : BillboardColumn[] = billboard.map((item)=>({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillBoardClient data={formattedBillboards}/>
            </div>
        </div>
    );
};
export default Billboards;