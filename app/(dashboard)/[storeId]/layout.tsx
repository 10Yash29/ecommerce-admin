import React from "react";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prismadb from "@/lib/prismadb";
import NavBar from "@/components/NavBar";
const  DashboardLayout = async ({children, params}:{children: React.ReactNode, params: {userId : string}}) =>{

    const {userId} = auth();
    if(!userId){
        redirect('/sign-in');
    }
    const store = await prismadb.store.findFirst({
        where: {
            userId,
            id: params.userId,
        }
    });
    if(!store){
        redirect('/');
    }

    return (
        <div>
            <NavBar/>
            {children}
        </div>
    );
};
export default DashboardLayout;