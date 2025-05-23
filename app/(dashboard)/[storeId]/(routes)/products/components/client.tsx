
'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import {ProductColumn} from "@/app/(dashboard)/[storeId]/(routes)/products/components/column";
import ApiList from "@/components/ui/api-list";
import {columns} from "@/app/(dashboard)/[storeId]/(routes)/products/components/column";
import Heading from "@/components/Heading";


interface ProductsClientProps {
    data: ProductColumn[];
}

export const ProductsClient = ({ data }: ProductsClientProps) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Products(${data.length})`}
                    description='Manage products of your store'
                />
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add new
                </Button>
            </div>

            <Separator />
            <DataTable searchKey='name' columns={columns} data={data} />
            <Heading title='API' description='API calls for Products' />
            <Separator />
            <ApiList entityName='products' entityIdName='productId' />
        </>
    );
};
