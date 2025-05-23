import prismadb from "@/lib/prismadb";
import {format} from "date-fns";
import {SizesColumn} from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/column";
import SizesClient from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/client";

const SizesPage = async ({params}:{params : {storeId : string}})=>{

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSizes : SizesColumn[] = sizes.map((item)=>({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizesClient data={formattedSizes}/>
            </div>
        </div>
    );
};
export default SizesPage;