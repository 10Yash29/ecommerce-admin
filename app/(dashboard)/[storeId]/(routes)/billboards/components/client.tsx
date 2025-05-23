'use client'
import Heading from "@/components/Heading";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import {BillboardColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/column";
import {DataTable} from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface ClientProps {
    data : BillboardColumn[]
}

const BillBoardClient = ({data}:ClientProps)=>{
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Billboards(${data.length})`} description={'Manage billboards for your store'}/>
                <Button onClick={()=>router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="label" columns={columns} data={data}/>
            <Heading title={'API'} description={'API calls for Billboards'}/>
            <Separator/>
            <ApiList entityName={'billboards'} entityIdName={'billboardId'}/>
        </>
    );
};
export default BillBoardClient;