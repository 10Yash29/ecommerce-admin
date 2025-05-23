'use client'
import {Store} from "@prisma/client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,

} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast";
import axios from "axios";
import {useParams} from "next/navigation";
import {useRouter} from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import {ApiAlert} from "@/components/ui/api-alert";
import Origin from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Store
}
const formSchema = z.object({
    name: z.string().min(1)
})
type settingValueForm = z.infer<typeof formSchema>
const SettingsForm = ({initialData}:SettingsFormProps) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const[loading, setLoading] = useState(false);
    const origin = Origin();
    const form = useForm<settingValueForm>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const onSubmit = async (data: settingValueForm)=> {
       try{
           setLoading(true);
           await axios.patch(`/api/stores/${params.storeId}`, data);
           router.refresh();
           toast.success('Store updated');
       }
       catch(error){
           toast.error('Something went wrong!');
       }
       finally {
           setLoading(false);
       }
    }
    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh();
            router.push('/')
            toast.success('Store deleted');
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
            <AlertModal isOpen={open} onClose={()=>{setOpen(false)}} onConfirm={onDelete} loading={loading}/>
            <div className="flex items-center justify-between">
            <Heading
                title="Settings"
                description="Manage Store Preferences"
            />
                <Button
                    disabled={loading}
                    variant={"destructive"}
                    size={"icon"}
                    onClick={()=>setOpen(true)}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    </div>
                    <Button disabled={loading} className="ml-auto" type={"submit"}>
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator/>
            <ApiAlert title={'NEXT_PUBLIC_API_URL'} description={`${origin}/api/${params.storeId}`} variant={"public"}/>
        </>
    );
};
export default SettingsForm;