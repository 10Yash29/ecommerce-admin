'use client'

import {useEffect, useState} from "react";
import {Modal} from "@/components/ui/modal";
import {Button} from "@/components/ui/button";

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}
const AlertModal = ({isOpen, onClose, onConfirm, loading}:AlertModalProps)=>{

    const[isMounted, setIsMounted] = useState(false);
    useEffect(()=>{
        setIsMounted(true);
    },[])

    if(!isMounted){
        return null;
    }
    return (
            <Modal title={'Are you sure'} description={"This action can't be undone"} isOpen={isOpen} onClose={onClose}>
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button
                        variant={'outline'}
                        disabled={loading}
                        onClick={onClose}
                    >Cancel</Button>
                    <Button
                        disabled={loading}
                        onClick={onConfirm}
                        variant={'destructive'}
                    >
                        Continue
                    </Button>
                </div>
            </Modal>
    )

};
export default AlertModal;