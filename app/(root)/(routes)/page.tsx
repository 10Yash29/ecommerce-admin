'use client'
import {useStoreModal} from "@/hooks/use-store-modal";
import {useEffect} from "react";

export default function Home() {

    const onOpen = useStoreModal((state)=>state.onOpen);
    const isOpen = useStoreModal((state)=>state.isOpen);
    useEffect(()=>{
        if(!isOpen) {
            onOpen();
        }
    },[onOpen,isOpen])
  return null;
}
