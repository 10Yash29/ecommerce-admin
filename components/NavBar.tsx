import {UserButton} from "@clerk/nextjs";
import MainNav from "@/components/Main-Nav";
import StoreSwitcher from "@/components/store-switcher"
import {auth} from "@clerk/nextjs/server";
import {router} from "next/client";
import prismadb from "@/lib/prismadb";
import {redirect} from "next/navigation";

const NavBar = async () => {

    const {userId} = auth();
    if(!userId){
        redirect('/sign-in');
    }
    const stores = await prismadb.store.findMany({
        where:{
            userId,
        }
    })
    return (
        <div className="border-b">
            <div className="flex items-center h-16 justify-between">
                <div className="ml-4">
                    <StoreSwitcher items={stores} />
                </div>
                <div>
                    <MainNav className="mx-6"/>
                </div>
                <div className="ml-auto flex items-center space-x-4 mr-4">
                    <UserButton/>
                </div>
            </div>
        </div>
    );
};
export default NavBar;