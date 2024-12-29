'use client'
import Heading from "@/components/Heading";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {Separator} from "@/components/ui/separator";

import {DataTable} from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";
import {columns} from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/column";
import {SizesColumn} from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/column";

interface SizesClientProps {
    data : SizesColumn[]
}

const SizesClient = ({data}:SizesClientProps)=>{
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Sizes(${data.length})`} description={'Manage sizes for your store'}/>
                <Button onClick={()=>router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title={'API'} description={'API calls for Sizes'}/>
            <Separator/>
            <ApiList entityName={'sizes'} entityIdName={'sizeId'}/>
        </>
    );
};
export default SizesClient;