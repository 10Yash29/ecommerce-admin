import {useEffect, useState} from "react";

const Origin = ()=>{
    const[isMounted, setIsMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
    useEffect(()=>{
        setIsMounted(true);
    },[])
    if(!isMounted){
        return ''
    }
    return origin
};
export default Origin;