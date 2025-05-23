
'use client';

import { DataTable } from '@/components/ui/data-table';

import { Separator } from '@/components/ui/separator';
import React from "react";
import {OrderColumn} from "@/app/(dashboard)/[storeId]/(routes)/orders/components/column";
import Heading from "@/components/Heading";
import {columns} from "@/app/(dashboard)/[storeId]/(routes)/orders/components/column";



interface OrderClientProps {
    data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
    return (
        <>
            <Heading
                title={`Orders (${data.length})`}
                description='Manage orders for your store'
            />
            <Separator />
            <DataTable searchKey='products' columns={columns} data={data} />
        </>
    );
};
