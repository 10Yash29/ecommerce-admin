import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Copy, Edit, MoreHorizontal, Trash} from "lucide-react";
import toast from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {useState} from "react";
import AlertModal from "@/components/modals/alert-modal";
import {ColorsColumn} from "@/app/(dashboard)/[storeId]/(routes)/colors/components/column";


interface CellActionProps {
    data: ColorsColumn
}

const CellAction = ({data}: CellActionProps)=>{
    const[loading, setLoading] = useState(false);
    const[open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    const copy = (id : string)=>{
        navigator.clipboard.writeText(id);
        toast.success("Color Id copied to the clipboard");
    }
    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${data.id}`)
            router.refresh();
            toast.success('Color deleted');
        }
        catch(error){
            toast.error('Something went wrong!');
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    }
    return (
        <>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" variant={'ghost'}>
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                    Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={()=>copy(data.id)}>
                    <Copy className="mr-2 h-4 w-4"/>
                    CopyId
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(true)}>
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
        </>
    );
};
export default CellAction;